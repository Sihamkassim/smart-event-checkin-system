import { defineStore } from 'pinia';
import { ref } from 'vue';
import { visitorsAPI } from '../api/visitors';

export const useVisitorStore = defineStore('visitor', () => {
  const visitors = ref([]);
  const currentVisitor = ref(null);
  const isLoading = ref(false);

  const fetchVisitorsByEvent = async (eventId) => {
    isLoading.value = true;
    try {
      const response = await visitorsAPI.getByEvent(eventId);
      visitors.value = response.visitors || response;
    } finally {
      isLoading.value = false;
    }
  };

  const searchVisitors = async (eventId, query) => {
    isLoading.value = true;
    try {
      const response = await visitorsAPI.search(eventId, query);
      visitors.value = response.visitors || response;
    } finally {
      isLoading.value = false;
    }
  };

  const createVisitor = async (eventId, visitorData) => {
    isLoading.value = true;
    try {
      const response = await visitorsAPI.create(eventId, visitorData);
      visitors.value.push(response.visitor || response);
      return { success: true };
    } catch (err) {
      return { success: false };
    } finally {
      isLoading.value = false;
    }
  };

  const bulkCreateVisitors = async (eventId, visitorsData) => {
    isLoading.value = true;
    try {
      const response = await visitorsAPI.bulkCreate(eventId, visitorsData);
      // Re-fetch visitors to get the updated list including tokens
      await fetchVisitorsByEvent(eventId);
      return { success: true, count: response.count };
    } catch (err) {
      return { success: false };
    } finally {
      isLoading.value = false;
    }
  };

  const updateVisitor = async (id, visitorData) => {
    isLoading.value = true;
    try {
      const response = await visitorsAPI.update(id, visitorData);
      const index = visitors.value.findIndex((v) => v.id === id);
      if (index !== -1) {
        visitors.value[index] = response.visitor || response;
      }
      if (currentVisitor.value?.id === id) {
        currentVisitor.value = response.visitor || response;
      }
      return { success: true };
    } catch (err) {
      return { success: false };
    } finally {
      isLoading.value = false;
    }
  };

  const deleteVisitor = async (id) => {
    isLoading.value = true;
    try {
      await visitorsAPI.delete(id);
      visitors.value = visitors.value.filter((v) => v.id !== id);
      if (currentVisitor.value?.id === id) {
        currentVisitor.value = null;
      }
      return { success: true };
    } catch (err) {
      return { success: false };
    } finally {
      isLoading.value = false;
    }
  };

  return {
    visitors,
    currentVisitor,
    isLoading,
    fetchVisitorsByEvent,
    searchVisitors,
    createVisitor,
    bulkCreateVisitors,
    updateVisitor,
    deleteVisitor,
  };
});
