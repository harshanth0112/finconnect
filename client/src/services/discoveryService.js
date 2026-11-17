import api from './api';

/**
 * Search and discover users, professionals, students with filters
 */
export const searchDiscovery = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.q) params.append('q', filters.q);
  if (filters.accountType) params.append('accountType', filters.accountType);
  if (filters.location) params.append('location', filters.location);
  if (filters.skill) params.append('skill', filters.skill);
  if (filters.verifiedOnly) params.append('verifiedOnly', 'true');
  if (filters.page) params.append('page', filters.page);

  const response = await api.get(`/users/discovery?${params.toString()}`);
  return response.data?.data;
};

