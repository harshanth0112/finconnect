const Connection = require('../models/Connection');
const Follow = require('../models/Follow');
const User = require('../models/User');
const Profile = require('../models/Profile');
const notificationService = require('./notificationService');

/**
 * Send connection request
 */
const sendConnectionRequest = async (requesterId, recipientId) => {
  if (requesterId.toString() === recipientId.toString()) {
    throw new Error('Cannot send connection request to yourself');
  }

  // Check if either direction exists
  const existing = await Connection.findOne({
    $or: [
      { requester: requesterId, recipient: recipientId },
      { requester: recipientId, recipient: requesterId }
    ]
  });

  if (existing) {
    if (existing.status === 'accepted') throw new Error('Already connected');
    if (existing.status === 'pending') throw new Error('Connection request already pending');
    // If rejected, update to pending
    existing.requester = requesterId;
    existing.recipient = recipientId;
    existing.status = 'pending';
    await existing.save();
    return existing;
  }

  const connection = await Connection.create({
    requester: requesterId,
    recipient: recipientId,
    status: 'pending'
  });

  // Trigger notification
  const requesterUser = await User.findById(requesterId);
  await notificationService.createNotification({
    recipient: recipientId,
    sender: requesterId,
    type: 'connection_request',
    title: 'New Connection Request',
    message: `${requesterUser?.fullName || 'Someone'} sent you a connection request`,
    entityId: connection._id,
    entityType: 'user'
  });

  return connection;
};

/**
 * Respond to connection request (accept or reject)
 */
const respondConnectionRequest = async (userId, connectionId, action) => {
  const connection = await Connection.findById(connectionId);
  if (!connection) throw new Error('Connection request not found');

  if (connection.recipient.toString() !== userId.toString()) {
    throw new Error('Unauthorized to respond to this request');
  }

  if (action === 'accept') {
    connection.status = 'accepted';
    await connection.save();

    // Increment connectionsCount on both profiles
    await Profile.findOneAndUpdate({ user: connection.requester }, { $inc: { connectionsCount: 1 } });
    await Profile.findOneAndUpdate({ user: connection.recipient }, { $inc: { connectionsCount: 1 } });

    // Notify requester that connection was accepted
    const acceptorUser = await User.findById(userId);
    await notificationService.createNotification({
      recipient: connection.requester,
      sender: userId,
      type: 'connection_accepted',
      title: 'Connection Accepted',
      message: `${acceptorUser?.fullName || 'Someone'} accepted your connection request`,
      entityId: connection._id,
      entityType: 'user'
    });
  } else if (action === 'reject') {
    connection.status = 'rejected';
    await connection.save();
  } else {
    throw new Error('Invalid action');
  }

  return connection;
};

/**
 * Get all connections and pending requests for current user
 */
const getMyConnections = async (userId) => {
  // Accepted connections
  const accepted = await Connection.find({
    $or: [{ requester: userId }, { recipient: userId }],
    status: 'accepted'
  })
    .populate('requester', 'fullName email accountType profileImage')
    .populate('recipient', 'fullName email accountType profileImage');

  // Pending requests received
  const pendingReceived = await Connection.find({
    recipient: userId,
    status: 'pending'
  }).populate('requester', 'fullName email accountType profileImage');

  // Pending requests sent
  const pendingSent = await Connection.find({
    requester: userId,
    status: 'pending'
  }).populate('recipient', 'fullName email accountType profileImage');

  return { accepted, pendingReceived, pendingSent };
};

/**
 * Toggle follow/unfollow user
 */
const toggleFollow = async (followerId, followingId) => {
  if (followerId.toString() === followingId.toString()) {
    throw new Error('Cannot follow yourself');
  }

  const existing = await Follow.findOne({ follower: followerId, following: followingId });

  if (existing) {
    await Follow.findByIdAndDelete(existing._id);
    await Profile.findOneAndUpdate({ user: followerId }, { $inc: { followingCount: -1 } });
    await Profile.findOneAndUpdate({ user: followingId }, { $inc: { followersCount: -1 } });
    return { following: false };
  } else {
    await Follow.create({ follower: followerId, following: followingId });
    await Profile.findOneAndUpdate({ user: followerId }, { $inc: { followingCount: 1 } });
    await Profile.findOneAndUpdate({ user: followingId }, { $inc: { followersCount: 1 } });

    // Notify followed user
    const followerUser = await User.findById(followerId);
    await notificationService.createNotification({
      recipient: followingId,
      sender: followerId,
      type: 'new_follower',
      title: 'New Follower',
      message: `${followerUser?.fullName || 'Someone'} started following you`,
      entityId: followerId,
      entityType: 'user'
    });

    return { following: true };
  }
};

/**
 * Cancel connection request sent by current user
 */
const cancelConnectionRequest = async (userId, connectionId) => {
  const connection = await Connection.findById(connectionId);
  if (!connection) throw new Error('Connection request not found');

  if (connection.requester.toString() !== userId.toString()) {
    throw new Error('Unauthorized to cancel this request');
  }

  await Connection.findByIdAndDelete(connectionId);
  return { success: true };
};

/**
 * Get mutual connections between two users
 */
const getMutualConnections = async (userId, targetUserId) => {
  // 1. Get current user's connected user IDs
  const userConns = await Connection.find({
    $or: [{ requester: userId }, { recipient: userId }],
    status: 'accepted'
  });

  const userConnectedIds = new Set(
    userConns.map((c) =>
      c.requester.toString() === userId.toString()
        ? c.recipient.toString()
        : c.requester.toString()
    )
  );

  // 2. Get target user's connected user IDs
  const targetConns = await Connection.find({
    $or: [{ requester: targetUserId }, { recipient: targetUserId }],
    status: 'accepted'
  });

  const targetConnectedIds = targetConns.map((c) =>
    c.requester.toString() === targetUserId.toString()
      ? c.recipient.toString()
      : c.requester.toString()
  );

  // 3. Find intersection
  const mutualIds = targetConnectedIds.filter((id) => userConnectedIds.has(id));

  const mutualUsers = await User.find({ _id: { $in: mutualIds } })
    .select('fullName email profileImage accountType role');

  return {
    mutualConnections: mutualUsers,
    count: mutualUsers.length
  };
};

module.exports = {
  sendConnectionRequest,
  respondConnectionRequest,
  getMyConnections,
  getMutualConnections,
  toggleFollow,
  cancelConnectionRequest
};

