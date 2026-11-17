const adminService = require('../services/adminService');

/**
 * GET /api/v1/admin/stats
 */
const getStats = async (req, res) => {
  try {
    const stats = await adminService.getPlatformStats();
    return res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('[AdminController.getStats] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin stats',
      error: error.message
    });
  }
};

/**
 * GET /api/v1/admin/users
 */
const getUsers = async (req, res) => {
  try {
    const { q, role, status, page, limit } = req.query;
    const result = await adminService.getUsersList({ q, role, status, page, limit });
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('[AdminController.getUsers] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      error: error.message
    });
  }
};

/**
 * PATCH /api/v1/admin/users/:id/status
 */
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    const user = await adminService.toggleUserStatus(req.user._id, id, { status, reason });
    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('[AdminController.updateUserStatus] Error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to update user status'
    });
  }
};

/**
 * DELETE /api/v1/admin/posts/:id
 */
const moderatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    await adminService.moderatePost(req.user._id, id, { reason });
    return res.status(200).json({
      success: true,
      message: 'Post removed successfully'
    });
  } catch (error) {
    console.error('[AdminController.moderatePost] Error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to moderate post'
    });
  }
};

/**
 * GET /api/v1/admin/logs
 */
const getLogs = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = await adminService.getAuditLogs({ page, limit });
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('[AdminController.getLogs] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve audit logs',
      error: error.message
    });
  }
};

module.exports = {
  getStats,
  getUsers,
  updateUserStatus,
  moderatePost,
  getLogs
};
