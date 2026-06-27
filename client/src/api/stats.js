import apiClient from './client';

export const statsAPI = {
  getGlobalStats: async () => {
    const response = await apiClient.get('/stats/global');
    return response.data;
  },

  askAi: async (question) => {
    const response = await apiClient.post('/stats/ask', { question });
    return response.data;
  },

  askEventAi: async (eventId, question) => {
    const response = await apiClient.post(`/events/${eventId}/assistant`, { question });
    return response.data;
  },
};
