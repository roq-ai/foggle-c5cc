import axios from 'axios';
import queryString from 'query-string';
import { FeatureFlagInterface, FeatureFlagGetQueryInterface } from 'interfaces/feature-flag';
import { GetQueryInterface } from '../../interfaces';

export const getFeatureFlags = async (query?: FeatureFlagGetQueryInterface) => {
  const response = await axios.get(`/api/feature-flags${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createFeatureFlag = async (featureFlag: FeatureFlagInterface) => {
  const response = await axios.post('/api/feature-flags', featureFlag);
  return response.data;
};

export const updateFeatureFlagById = async (id: string, featureFlag: FeatureFlagInterface) => {
  const response = await axios.put(`/api/feature-flags/${id}`, featureFlag);
  return response.data;
};

export const getFeatureFlagById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/feature-flags/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteFeatureFlagById = async (id: string) => {
  const response = await axios.delete(`/api/feature-flags/${id}`);
  return response.data;
};
