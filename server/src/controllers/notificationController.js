const notificationService = require('../services/notificationService');

/**
 * GET /api/v1/notifications
 */
const getNotifications = async (req, res) => {
  try {
    const { page, limit, unreadOnly } = req.query;
    const result = await notificationService.getUserNotifications(req.user._id, {
      page,
      limit,
      unreadOnly
    });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('[NotificationController.getNotifications] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve notifications',
      error: error.message
    });
  }
};

/**
 * PATCH /api/v1/notifications/:id/read
 */
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await notificationService.markAsRead(req.user._id, id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('[NotificationController.markAsRead] Error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to mark notification as read'
    });
  }
};

/**
 * PATCH /api/v1/notifications/read-all
 */
const markAllAsRead = async (req, res) => {
  try {
    await notificationService.markAllAsRead(req.user._id);

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('[NotificationController.markAllAsRead] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark all as read',
      error: error.message
    });
  }
};

/**
 * DELETE /api/v1/notifications/:id
 */
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await notificationService.deleteNotification(req.user._id, id);

    return res.status(200).json({
      success: true,
      message: 'Notification removed'
    });
  } catch (error) {
    console.error('[NotificationController.deleteNotification] Error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete notification'
    });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
};

