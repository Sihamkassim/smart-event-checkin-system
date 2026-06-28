import apiClient from './client';
import { message } from 'ant-design-vue';

export const usersAPI = {
  getAll: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  },

  createStaff: async (staffData) => {
    const response = await apiClient.post('/users', staffData);
    if (response.data.success) {
      message.success('Staff account created successfully');
    }
    return response.data;
  },

  updateStaff: async (id, staffData) => {
    const response = await apiClient.put(`/users/${id}`, staffData);
    if (response.data.success) {
      message.success('Staff account updated successfully');
    }
    return response.data;
  },

  sendActivationEmail: async (id) => {
    const response = await apiClient.post(`/users/${id}/send-activation`);
    if (response.data.success) {
      message.success(response.data.message || 'Email sent successfully');
    }
    return response.data;
  },
};
