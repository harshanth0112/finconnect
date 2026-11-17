import api from './api';

/**
 * Fetch feed posts with optional pagination and hashtag filtering
 */
export const getPosts = async (page = 1, hashtag = '') => {
  let url = `/posts?page=${page}&limit=10`;
  if (hashtag) url += `&hashtag=${encodeURIComponent(hashtag)}`;
  const response = await api.get(url);
  return response.data?.data;
};

/**
 * Create a new post
 */
export const createPost = async (postData) => {
  const response = await api.post('/posts', postData);
  return response.data?.data;
};

/**
 * Toggle like reaction
 */
export const toggleReaction = async (postId, type = 'like') => {
  const response = await api.post(`/posts/${postId}/reactions`, { type });
  return response.data?.data;
};

/**
 * Fetch comments for a post
 */
export const getComments = async (postId) => {
  const response = await api.get(`/posts/${postId}/comments`);
  return response.data?.data;
};

/**
 * Add comment to a post
 */
export const addComment = async (postId, content) => {
  const response = await api.post(`/posts/${postId}/comments`, { content });
  return response.data?.data;
};

/**
 * Toggle bookmark on post
 */
export const toggleBookmark = async (postId) => {
  const response = await api.post(`/posts/${postId}/bookmark`);
  return response.data?.data;
};

/**
 * Get bookmarked posts
 */
export const getBookmarkedPosts = async (page = 1) => {
  const response = await api.get(`/posts/bookmarked?page=${page}&limit=10`);
  return response.data?.data;
};

/**
 * Delete a post
 */
export const deletePost = async (postId) => {
  const response = await api.delete(`/posts/${postId}`);
  return response.data?.data;
};

