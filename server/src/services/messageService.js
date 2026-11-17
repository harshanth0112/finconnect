const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

/**
 * Get or create a 1-to-1 conversation with another user
 */
const getOrCreateConversation = async (userId, targetUserId) => {
  if (userId.toString() === targetUserId.toString()) {
    throw new Error('Cannot start a conversation with yourself');
  }

  const targetUser = await User.findById(targetUserId);
  if (!targetUser) {
    throw new Error('Target user not found');
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [userId, targetUserId], $size: 2 }
  })
    .populate('participants', 'fullName email profileImage accountType')
    .populate('lastMessage');

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [userId, targetUserId],
      initiatedBy: userId,
      status: 'active'
    });

    conversation = await Conversation.findById(conversation._id)
      .populate('participants', 'fullName email profileImage accountType');
  }

  return conversation;
};

/**
 * Get all conversations for a user
 */
const getUserConversations = async (userId) => {
  const conversations = await Conversation.find({
    participants: userId
  })
    .populate('participants', 'fullName email profileImage accountType')
    .populate('lastMessage')
    .sort({ lastMessageAt: -1 });

  return conversations;
};

/**
 * Get messages for a conversation with pagination
 */
const getConversationMessages = async (userId, conversationId, { page = 1, limit = 50 } = {}) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId
  });

  if (!conversation) {
    throw new Error('Conversation not found or access denied');
  }

  const skip = (page - 1) * limit;

  const messages = await Message.find({ conversation: conversationId })
    .populate('sender', 'fullName email profileImage')
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Message.countDocuments({ conversation: conversationId });

  // Mark unread messages as read by current user
  await Message.updateMany(
    {
      conversation: conversationId,
      sender: { $ne: userId },
      readBy: { $ne: userId }
    },
    {
      $addToSet: { readBy: userId }
    }
  );

  return {
    messages,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Send a message in a conversation
 */
const sendMessage = async (userId, conversationId, { text, mediaUrl, mediaType }) => {
  if (!text?.trim() && !mediaUrl?.trim()) {
    throw new Error('Message content or media attachment is required');
  }

  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId
  });

  if (!conversation) {
    throw new Error('Conversation not found or access denied');
  }

  const message = await Message.create({
    conversation: conversationId,
    sender: userId,
    text: text ? text.trim() : '',
    mediaUrl: mediaUrl ? mediaUrl.trim() : '',
    mediaType: mediaType || (mediaUrl ? 'image' : ''),
    readBy: [userId]
  });

  conversation.lastMessage = message._id;
  conversation.lastMessageAt = message.createdAt;
  await conversation.save();

  const populatedMessage = await Message.findById(message._id)
    .populate('sender', 'fullName email profileImage');

  return populatedMessage;
};

/**
 * Mark messages in a conversation as read
 */
const markAsRead = async (userId, conversationId) => {
  await Message.updateMany(
    {
      conversation: conversationId,
      sender: { $ne: userId },
      readBy: { $ne: userId }
    },
    {
      $addToSet: { readBy: userId }
    }
  );

  return { success: true };
};

module.exports = {
  getOrCreateConversation,
  getUserConversations,
  getConversationMessages,
  sendMessage,
  markAsRead
};

