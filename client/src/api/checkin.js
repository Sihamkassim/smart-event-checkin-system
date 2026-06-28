import apiClient from './client';
import { message } from 'ant-design-vue';

export const checkinAPI = {
  checkIn: async (token) => {
    const response = await apiClient.post('/check-in/', { token });
    if (response.data.success) {
      message.success(response.data.message || 'Check-in successful');
    } else {
      message.warning(response.data.message || 'Check-in failed');
    }
    return response.data;
  },
};
