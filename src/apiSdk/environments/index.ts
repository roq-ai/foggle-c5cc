import axios from 'axios';
import queryString from 'query-string';
import { EnvironmentInterface, EnvironmentGetQueryInterface } from 'interfaces/environment';
import { GetQueryInterface } from '../../interfaces';

export const getEnvironments = async (query?: EnvironmentGetQueryInterface) => {
  const response = await axios.get(`/api/environments${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createEnvironment = async (environment: EnvironmentInterface) => {
  const response = await axios.post('/api/environments', environment);
  return response.data;
};

export const updateEnvironmentById = async (id: string, environment: EnvironmentInterface) => {
  const response = await axios.put(`/api/environments/${id}`, environment);
  return response.data;
};

export const getEnvironmentById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/environments/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteEnvironmentById = async (id: string) => {
  const response = await axios.delete(`/api/environments/${id}`);
  return response.data;
};
