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

  export: async (eventId) => {
    const response = await apiClient.get(`/visitors/${eventId}/export`, {
      responseType: 'blob', // Important for downloading files
    });
    
    // Create a download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `visitors_event_${eventId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return { success: true };
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
