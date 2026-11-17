import api from './api';

/**
 * Fetch current user's profile
 */
export const getMyProfile = async () => {
  const response = await api.get('/profiles/me');
  return response.data?.data;
};

/**
 * Update current user's profile
 */
export const updateMyProfile = async (profileData) => {
  const response = await api.put('/profiles/me', profileData);
  return response.data?.data;
};

/**
 * Get public profile by identifier
 */
export const getProfileById = async (id) => {
  const response = await api.get(`/profiles/${id}`);
  return response.data?.data;
};

