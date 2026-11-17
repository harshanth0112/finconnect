import api from './api';

/**
 * Get all conversations for current user
 */
export const getConversations = async () => {
  const response = await api.get('/conversations');
  return response.data?.data || [];
};

/**
 * Create or open conversation with a target user
 */
export const startConversation = async (targetUserId) => {
  const response = await api.post('/conversations', { targetUserId });
  return response.data?.data;
};

/**
 * Get messages in a conversation
 */
export const getMessages = async (conversationId, page = 1) => {
  const response = await api.get(`/conversations/${conversationId}/messages?page=${page}&limit=50`);
  return response.data?.data;
};

/**
 * Send a message via HTTP fallback
 */
export const sendMessageApi = async (conversationId, payload) => {
  const response = await api.post(`/conversations/${conversationId}/messages`, payload);
  return response.data?.data;
};

/**
 * Mark conversation as read
 */
export const markConversationRead = async (conversationId) => {
  const response = await api.post(`/conversations/${conversationId}/read`);
  return response.data;
};

