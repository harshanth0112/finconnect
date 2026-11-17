import api from './api';

/**
 * Get user notifications with optional pagination and unread filter
 */
export const getNotifications = async ({ page = 1, limit = 20, unreadOnly = false } = {}) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page);
  if (limit) params.append('limit', limit);
  if (unreadOnly) params.append('unreadOnly', 'true');

  const response = await api.get(`/notifications?${params.toString()}`);
  return response.data?.data;
};

/**
 * Mark a single notification as read
 */
export const markNotificationRead = async (notificationId) => {
  const response = await api.patch(`/notifications/${notificationId}/read`);
  return response.data?.data;
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsRead = async () => {
  const response = await api.patch('/notifications/read-all');
  return response.data;
};

/**
 * Delete a notification
 */
export const deleteNotification = async (notificationId) => {
  const response = await api.delete(`/notifications/${notificationId}`);
  return response.data;
};

