<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="glass-card rounded-2xl h-64 p-5 flex flex-col">
        <a-skeleton active :paragraph="{ rows: 3 }" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!events?.length" class="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
      <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CalendarOutlined class="text-3xl text-slate-400" />
      </div>
      <h3 class="text-lg font-bold text-slate-800 mb-2">No Events Found</h3>
      <p class="text-slate-500 max-w-md mx-auto mb-6">You don't have any events matching your criteria. Create a new event to get started with check-ins.</p>
      <a-button type="primary" size="large" @click="$emit('create')" class="bg-brand-500 hover:bg-brand-600 rounded-lg">
        <template #icon><PlusOutlined /></template>
        Create New Event
      </a-button>
    </div>

    <!-- Events Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <EventCard 
        v-for="event in events" 
        :key="event.id" 
        :event="event" 
        @click="$emit('view', event)"
        @delete="$emit('delete', event.id)"
      />
    </div>
  </div>
</template>

<script setup>
import { CalendarOutlined, PlusOutlined } from '@ant-design/icons-vue';
import EventCard from './EventCard.vue';

defineProps({
  events: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['view', 'delete', 'create']);
</script>
