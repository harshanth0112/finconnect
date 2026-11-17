const User = require('../models/User');
const Post = require('../models/Post');
const Verification = require('../models/Verification');
const Organisation = require('../models/Organisation');
const AuditLog = require('../models/AuditLog');
const notificationService = require('./notificationService');

/**
 * Log administrative action for compliance/audit
 */
const logAction = async ({ adminId, action, targetType, targetId, details, ipAddress }) => {
  try {
    await AuditLog.create({
      admin: adminId,
      action,
      targetType,
      targetId,
      details,
      ipAddress
    });
  } catch (err) {
    console.error('[AuditLog] Failed to record log:', err.message);
  }
};

/**
 * Get high-level system metrics & platform counters
 */
const getPlatformStats = async () => {
  const [totalUsers, activeVerifications, totalPosts, totalOrganisations] = await Promise.all([
    User.countDocuments(),
    Verification.countDocuments({ status: 'pending' }),
    Post.countDocuments(),
    Organisation.countDocuments()
  ]);

  const verifiedUsersCount = await User.countDocuments({
    _id: { $in: await Verification.distinct('user', { status: 'approved' }) }
  });

  return {
    totalUsers,
    pendingVerifications: activeVerifications,
    totalPosts,
    totalOrganisations,
    verifiedUsersCount
  };
};

/**
 * List users with pagination and search for administration
 */
const getUsersList = async ({ q, role, status, page = 1, limit = 20 }) => {
  const query = {};
  if (q && q.trim()) {
    query.$or = [
      { fullName: { $regex: q.trim(), $options: 'i' } },
      { email: { $regex: q.trim(), $options: 'i' } }
    ];
  }
  if (role && role !== 'all') query.role = role;
  if (status && status !== 'all') query.status = status;

  const skip = (page - 1) * limit;
  const users = await User.find(query)
    .select('-__v')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await User.countDocuments(query);

  return {
    users,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Suspend or activate a user account
 */
const toggleUserStatus = async (adminId, userId, { status, reason }) => {
  if (adminId.toString() === userId.toString()) {
    throw new Error('Administrators cannot suspend their own account');
  }

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const oldStatus = user.status;
  user.status = status;
  await user.save();

  await logAction({
    adminId,
    action: status === 'suspended' ? 'USER_SUSPEND' : 'USER_ACTIVATE',
    targetType: 'user',
    targetId: user._id,
    details: { oldStatus, newStatus: status, reason }
  });

  // Notify user if suspended
  if (status === 'suspended') {
    await notificationService.createNotification({
      recipient: user._id,
      sender: adminId,
      type: 'verification_rejected',
      title: 'Account Suspended',
      message: `Your account was suspended by moderation. ${reason ? 'Reason: ' + reason : ''}`,
      entityId: user._id,
      entityType: 'user'
    });
  }

  return user;
};

/**
 * Moderate/Delete a post as administrator
 */
const moderatePost = async (adminId, postId, { reason }) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  await Post.findByIdAndDelete(postId);

  await logAction({
    adminId,
    action: 'POST_DELETE_MODERATION',
    targetType: 'post',
    targetId: postId,
    details: { author: post.author, reason }
  });

  // Notify author
  await notificationService.createNotification({
    recipient: post.author,
    sender: adminId,
    type: 'verification_rejected',
    title: 'Post Removed by Moderation',
    message: `A post you authored was removed by administration for violating community guidelines. ${reason ? 'Reason: ' + reason : ''}`,
    entityId: post.author,
    entityType: 'user'
  });

  return { success: true };
};

/**
 * Get recent audit logs
 */
const getAuditLogs = async ({ page = 1, limit = 20 } = {}) => {
  const skip = (page - 1) * limit;
  const logs = await AuditLog.find()
    .populate('admin', 'fullName email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await AuditLog.countDocuments();

  return {
    logs,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit)
    }
  };
};

module.exports = {
  getPlatformStats,
  getUsersList,
  toggleUserStatus,
  moderatePost,
  getAuditLogs,
  logAction
};
