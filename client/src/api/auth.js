import apiClient from './client';
import { message } from 'ant-design-vue';

export const authAPI = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.data.success) {
      message.success('Login successful');
    }
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  setupPassword: async (token, password) => {
    const response = await apiClient.post('/auth/setup-password', { token, password });
    return response.data;
  },
};
