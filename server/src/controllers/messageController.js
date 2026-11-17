const messageService = require('../services/messageService');

/**
 * GET /api/v1/conversations
 */
const getConversations = async (req, res) => {
  try {
    const conversations = await messageService.getUserConversations(req.user._id);
    return res.status(200).json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error('[MessageController.getConversations] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve conversations',
      error: error.message
    });
  }
};

/**
 * POST /api/v1/conversations
 * Body: { targetUserId }
 */
const createConversation = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        message: 'targetUserId is required'
      });
    }

    const conversation = await messageService.getOrCreateConversation(req.user._id, targetUserId);
    return res.status(200).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('[MessageController.createConversation] Error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to initialize conversation'
    });
  }
};

/**
 * GET /api/v1/conversations/:id/messages
 */
const getMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const { page, limit } = req.query;
    const result = await messageService.getConversationMessages(req.user._id, id, { page, limit });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('[MessageController.getMessages] Error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to retrieve messages'
    });
  }
};

/**
 * POST /api/v1/conversations/:id/messages
 * Body: { text, mediaUrl, mediaType }
 */
const postMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, mediaUrl, mediaType } = req.body;

    const message = await messageService.sendMessage(req.user._id, id, {
      text,
      mediaUrl,
      mediaType
    });

    return res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('[MessageController.postMessage] Error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to send message'
    });
  }
};

/**
 * POST /api/v1/conversations/:id/read
 */
const markRead = async (req, res) => {
  try {
    const { id } = req.params;
    await messageService.markAsRead(req.user._id, id);

    return res.status(200).json({
      success: true,
      message: 'Marked as read'
    });
  } catch (error) {
    console.error('[MessageController.markRead] Error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to mark as read'
    });
  }
};

module.exports = {
  getConversations,
  createConversation,
  getMessages,
  postMessage,
  markRead
};

