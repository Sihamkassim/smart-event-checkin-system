<template>
  <div class="w-full">
    <h2 class="m-0 mb-6 text-2xl font-bold">Upcoming Events</h2>
    
    <LoadingSpinner v-if="isLoading" />
    
    <template v-else>
      <a-row :gutter="16">
        <a-col :span="8" v-for="event in events" :key="event.id">
          <PublicEventCard :event="event" @register="handleRegister" />
        </a-col>
      </a-row>
      
      <a-empty v-if="events.length === 0" description="No events available" />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { publicAPI } from '../../api/public';
import PublicEventCard from './PublicEventCard.vue';
import LoadingSpinner from '../common/LoadingSpinner.vue';

const events = ref([]);
const isLoading = ref(false);

const emit = defineEmits(['register']);

onMounted(async () => {
  isLoading.value = true;
  try {
    const response = await publicAPI.getEvents();
    events.value = response.events || response;
  } catch (error) {
    console.error('Failed to fetch events:', error);
  } finally {
    isLoading.value = false;
  }
});

const handleRegister = (eventId) => {
  emit('register', eventId);
};
</script>
