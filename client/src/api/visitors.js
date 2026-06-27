import apiClient from './client';
import { message } from 'ant-design-vue';

export const visitorsAPI = {
  getByEvent: async (eventId) => {
    const response = await apiClient.get(`/visitors/${eventId}/visitors`);
    return response.data;
  },

  search: async (eventId, query) => {
    const response = await apiClient.get(`/visitors/${eventId}/visitors/search?q=${query}`);
    return response.data;
  },

  create: async (eventId, visitorData) => {
    const response = await apiClient.post(`/visitors/${eventId}/visitors`, visitorData);
    if (response.data.success) {
      message.success('Visitor added successfully');
    }
    return response.data;
  },

  bulkCreate: async (eventId, visitorsData) => {
    const response = await apiClient.post(`/visitors/${eventId}/visitors/bulk`, { visitors: visitorsData });
    if (response.data.success) {
      message.success(`${visitorsData.length} visitors imported successfully`);
    }
    return response.data;
  },

  update: async (id, visitorData) => {
    const response = await apiClient.put(`/visitors/${id}`, visitorData);
    if (response.data.success) {
      message.success('Visitor updated successfully');
    }
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/visitors/${id}`);
    if (response.data.success) {
      message.success('Visitor deleted successfully');
    }
    return response.data;
  },
};
