import api from './api';

/**
 * Get platform metrics and stats
 */
export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data?.data;
};

/**
 * Get users list with filters and search
 */
export const getAdminUsers = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.q) params.append('q', filters.q);
  if (filters.role) params.append('role', filters.role);
  if (filters.status) params.append('status', filters.status);
  if (filters.page) params.append('page', filters.page);

  const response = await api.get(`/admin/users?${params.toString()}`);
  return response.data?.data;
};

/**
 * Suspend or activate a user
 */
export const updateUserStatus = async (userId, { status, reason }) => {
  const response = await api.patch(`/admin/users/${userId}/status`, { status, reason });
  return response.data?.data;
};

/**
 * Moderate/delete a post
 */
export const moderateDeletePost = async (postId, reason) => {
  const response = await api.delete(`/admin/posts/${postId}`, { data: { reason } });
  return response.data;
};

/**
 * Get audit logs
 */
export const getAdminLogs = async (page = 1) => {
  const response = await api.get(`/admin/logs?page=${page}`);
  return response.data?.data;
};
