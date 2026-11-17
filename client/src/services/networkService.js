import api from './api';

/**
 * Fetch all connections and pending requests
 */
export const getMyConnections = async () => {
  const response = await api.get('/connections');
  return response.data?.data;
};

/**
 * Send connection request
 */
export const sendConnectionRequest = async (recipientId) => {
  const response = await api.post('/connections', { recipientId });
  return response.data?.data;
};

/**
 * Respond to connection request ('accept' or 'reject')
 */
export const respondConnectionRequest = async (connectionId, action) => {
  const response = await api.patch(`/connections/${connectionId}`, { action });
  return response.data?.data;
};

/**
 * Cancel connection request
 */
export const cancelConnectionRequest = async (connectionId) => {
  const response = await api.delete(`/connections/${connectionId}`);
  return response.data?.data;
};

/**
 * Toggle follow/unfollow user
 */
export const toggleFollow = async (userId) => {
  const response = await api.post(`/connections/follow/${userId}`);
  return response.data?.data;
};

/**
 * Get mutual connections with user
 */
export const getMutualConnections = async (userId) => {
  const response = await api.get(`/connections/mutual/${userId}`);
  return response.data?.data;
};

