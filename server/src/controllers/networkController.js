const networkService = require('../services/networkService');

/**
 * POST /api/v1/connections
 * Send connection request
 */
const sendRequest = async (req, res) => {
  try {
    const { recipientId } = req.body;
    if (!recipientId) {
      return res.status(400).json({
        success: false,
        message: 'Recipient ID is required'
      });
    }

    const connection = await networkService.sendConnectionRequest(req.user._id, recipientId);
    return res.status(201).json({
      success: true,
      message: 'Connection request sent successfully',
      data: connection
    });
  } catch (error) {
    console.error('[NetworkController.sendRequest] Error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to send request'
    });
  }
};

/**
 * GET /api/v1/connections
 * Get user connections and pending requests
 */
const getConnections = async (req, res) => {
  try {
    const data = await networkService.getMyConnections(req.user._id);
    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('[NetworkController.getConnections] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch connections'
    });
  }
};

/**
 * PATCH /api/v1/connections/:id
 * Accept or reject request
 */
const respondRequest = async (req, res) => {
  try {
    const { action } = req.body; // 'accept' or 'reject'
    const result = await networkService.respondConnectionRequest(req.user._id, req.params.id, action);
    return res.status(200).json({
      success: true,
      message: `Connection request ${action}ed`,
      data: result
    });
  } catch (error) {
    console.error('[NetworkController.respondRequest] Error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to respond to request'
    });
  }
};

/**
 * DELETE /api/v1/connections/:id
 * Cancel pending request
 */
const cancelRequest = async (req, res) => {
  try {
    const result = await networkService.cancelConnectionRequest(req.user._id, req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Connection request cancelled',
      data: result
    });
  } catch (error) {
    console.error('[NetworkController.cancelRequest] Error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to cancel request'
    });
  }
};

/**
 * POST /api/v1/connections/follow/:userId
 * Toggle follow/unfollow
 */
const toggleFollow = async (req, res) => {
  try {
    const result = await networkService.toggleFollow(req.user._id, req.params.userId);
    return res.status(200).json({
      success: true,
      message: result.following ? 'Followed user' : 'Unfollowed user',
      data: result
    });
  } catch (error) {
    console.error('[NetworkController.toggleFollow] Error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to toggle follow'
    });
  }
};

/**
 * GET /api/v1/connections/mutual/:userId
 */
const getMutual = async (req, res) => {
  try {
    const result = await networkService.getMutualConnections(req.user._id, req.params.userId);
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('[NetworkController.getMutual] Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch mutual connections'
    });
  }
};

module.exports = {
  sendRequest,
  getConnections,
  respondRequest,
  cancelRequest,
  toggleFollow,
  getMutual
};

