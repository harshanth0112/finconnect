import api from './api';

/**
 * Get all organisations with optional query parameters
 */
export const getOrganisations = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.q) params.append('q', filters.q);
  if (filters.industry) params.append('industry', filters.industry);
  if (filters.verifiedOnly) params.append('verifiedOnly', 'true');
  if (filters.page) params.append('page', filters.page);

  const response = await api.get(`/organisations?${params.toString()}`);
  return response.data?.data;
};

/**
 * Get organisation profile by ID or slug
 */
export const getOrganisationById = async (idOrSlug) => {
  const response = await api.get(`/organisations/${idOrSlug}`);
  return response.data?.data;
};

/**
 * Create a new organisation profile
 */
export const createOrganisation = async (payload) => {
  const response = await api.post('/organisations', payload);
  return response.data?.data;
};

/**
 * Update an existing organisation profile
 */
export const updateOrganisation = async (id, payload) => {
  const response = await api.put(`/organisations/${id}`, payload);
  return response.data?.data;
};

/**
 * Join or add team member to organisation
 */
export const joinOrganisation = async (id, payload = {}) => {
  const response = await api.post(`/organisations/${id}/members`, payload);
  return response.data?.data;
};

/**
 * Admin: review organisation verification
 */
export const verifyOrganisation = async (id, status) => {
  const response = await api.patch(`/organisations/${id}/verify`, { status });
  return response.data?.data;
};

