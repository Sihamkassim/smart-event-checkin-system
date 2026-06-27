import apiClient from './client';
import { message } from 'ant-design-vue';

export const eventsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/events');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/events/${id}`);
    return response.data;
  },

  create: async (eventData) => {
    // If it's FormData, tell Axios not to enforce application/json so it can set the boundary automatically
    const config = eventData instanceof FormData 
      ? { headers: { 'Content-Type': undefined } } 
      : {};
    const response = await apiClient.post('/events', eventData, config);
    if (response.data.success) {
      message.success('Event created successfully');
    }
    return response.data;
  },

  update: async (id, eventData) => {
    const config = eventData instanceof FormData 
      ? { headers: { 'Content-Type': undefined } } 
      : {};
    const response = await apiClient.put(`/events/${id}`, eventData, config);
    if (response.data.success) {
      message.success('Event updated successfully');
    }
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/events/${id}`);
    if (response.data.success) {
      message.success('Event deleted successfully');
    }
    return response.data;
  },

  getStats: async (id) => {
    const response = await apiClient.get(`/events/${id}/stats`);
    return response.data;
  },
};
