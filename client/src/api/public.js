import apiClient from './client';
import { message } from 'ant-design-vue';

export const publicAPI = {
  getEvents: async () => {
    const response = await apiClient.get('/public/events');
    return response.data;
  },

  register: async (registrationData) => {
    const response = await apiClient.post('/public/register', registrationData);
    if (response.data.success) {
      message.success('Registration successful! Your QR code has been generated.');
    }
    return response.data;
  },
};
