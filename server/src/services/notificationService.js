const Notification = require('../models/Notification');
const { getIO } = require('../socket/socketHandler');

/**
 * Create a new notification and push it via Socket.IO if recipient is connected
 */
const createNotification = async ({
  recipient,
  sender,
  type,
  title,
  message,
  entityId,
  entityType
}) => {
  try {
    // Avoid sending notification to oneself
    if (sender && recipient.toString() === sender.toString()) {
      return null;
    }

    const notification = await Notification.create({
      recipient,
      sender,
      type,
      title,
      message,
      entityId,
      entityType
    });

    const populatedNotification = await Notification.findById(notification._id)
      .populate('sender', 'fullName email profileImage accountType');

    // Emit real-time notification
    try {
      const io = getIO();
      if (io) {
        io.to(`user:${recipient.toString()}`).emit('new_notification', populatedNotification);
      }
    } catch (socketErr) {
      // Socket emission failure shouldn't fail database creation
      console.warn('[NotificationService] Socket emission skipped:', socketErr.message);
    }

    return populatedNotification;
  } catch (error) {
    console.error('[NotificationService.createNotification] Error:', error);
    return null;
  }
};

/**
 * Get user's notifications with pagination
 */
const getUserNotifications = async (userId, { page = 1, limit = 20, unreadOnly = false } = {}) => {
  const query = { recipient: userId };
  if (unreadOnly === true || unreadOnly === 'true') {
    query.isRead = false;
  }

  const skip = (page - 1) * limit;

  const notifications = await Notification.find(query)
    .populate('sender', 'fullName email profileImage accountType')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Notification.countDocuments(query);
  const unreadCount = await Notification.countDocuments({ recipient: userId, isRead: false });

  return {
    notifications,
    unreadCount,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Mark a single notification as read
 */
const markAsRead = async (userId, notificationId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { isRead: true },
    { new: true }
  );

  return notification;
};

/**
 * Mark all notifications as read for a user
 */
const markAllAsRead = async (userId) => {
  await Notification.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true }
  );

  return { success: true };
};

/**
 * Delete a notification
 */
const deleteNotification = async (userId, notificationId) => {
  const result = await Notification.findOneAndDelete({
    _id: notificationId,
    recipient: userId
  });

  return result;
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
};

