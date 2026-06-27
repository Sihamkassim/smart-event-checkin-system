import { defineStore } from 'pinia';
import { ref } from 'vue';
import { eventsAPI } from '../api/events';

export const useEventStore = defineStore('event', () => {
  const events = ref([]);
  const currentEvent = ref(null);
  const eventStats = ref(null);
  const isLoading = ref(false);

  const fetchEvents = async () => {
    isLoading.value = true;
    try {
      const response = await eventsAPI.getAll();
      events.value = response.events || response;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchEventById = async (id) => {
    isLoading.value = true;
    try {
      const response = await eventsAPI.getById(id);
      currentEvent.value = response.event || response;
    } finally {
      isLoading.value = false;
    }
  };

  const createEvent = async (eventData) => {
    isLoading.value = true;
    try {
      const response = await eventsAPI.create(eventData);
      events.value.push(response.event || response);
      return { success: true };
    } catch (err) {
      return { success: false };
    } finally {
      isLoading.value = false;
    }
  };

  const updateEvent = async (id, eventData) => {
    isLoading.value = true;
    try {
      const response = await eventsAPI.update(id, eventData);
      const index = events.value.findIndex((e) => e.id === id);
      if (index !== -1) {
        events.value[index] = response.event || response;
      }
      if (currentEvent.value?.id === id) {
        currentEvent.value = response.event || response;
      }
      return { success: true };
    } catch (err) {
      return { success: false };
    } finally {
      isLoading.value = false;
    }
  };

  const deleteEvent = async (id) => {
    isLoading.value = true;
    try {
      await eventsAPI.delete(id);
      events.value = events.value.filter((e) => e.id !== id);
      if (currentEvent.value?.id === id) {
        currentEvent.value = null;
      }
      return { success: true };
    } catch (err) {
      return { success: false };
    } finally {
      isLoading.value = false;
    }
  };

  const fetchEventStats = async (id) => {
    isLoading.value = true;
    try {
      const response = await eventsAPI.getStats(id);
      eventStats.value = response.stats || response;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    events,
    currentEvent,
    eventStats,
    isLoading,
    fetchEvents,
    fetchEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    fetchEventStats,
  };
});
