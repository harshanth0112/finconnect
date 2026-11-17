import api from './api';

/**
 * Submit credential verification request
 */
export const submitVerification = async (payload) => {
  const response = await api.post('/verifications', payload);
  return response.data?.data;
};

/**
 * Fetch current user's submitted credentials & applications
 */
export const getMyVerifications = async () => {
  const response = await api.get('/verifications/me');
  return response.data?.data;
};

/**
 * Admin: Get verification queue
 */
export const getAdminVerifications = async (status = '') => {
  const url = status ? `/admin/verifications?status=${status}` : '/admin/verifications';
  const response = await api.get(url);
  return response.data?.data;
};

/**
 * Admin: Update verification status
 */
export const reviewVerification = async (id, status, adminNotes) => {
  const response = await api.patch(`/admin/verifications/${id}`, {
    status,
    adminNotes
  });
  return response.data?.data;
};

