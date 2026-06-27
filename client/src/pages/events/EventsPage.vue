<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 tracking-tight">Events Management</h1>
        <p class="text-slate-500 mt-1">Create and manage your events and check-ins.</p>
      </div>
      
      <a-button type="primary" size="large" @click="handleCreate" class="bg-brand-500 hover:bg-brand-600 rounded-lg shadow-md shadow-brand-500/20">
        <template #icon><PlusOutlined /></template>
        New Event
      </a-button>
    </div>

    <!-- Search & Filters -->
    <div class="glass-card rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div class="w-full sm:w-96">
        <a-input-search
          v-model:value="searchQuery"
          placeholder="Search events..."
          size="large"
          class="w-full custom-search"
        />
      </div>
      
      <div class="flex items-center gap-3 w-full sm:w-auto">
        <a-select v-model:value="statusFilter" size="large" class="w-full sm:w-40" placeholder="Status">
          <a-select-option value="all">All Status</a-select-option>
          <a-select-option value="active">Active</a-select-option>
          <a-select-option value="upcoming">Upcoming</a-select-option>
          <a-select-option value="completed">Completed</a-select-option>
        </a-select>
      </div>
    </div>

    <EventList 
      :events="filteredEvents" 
      :loading="isLoading" 
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <a-modal
      v-model:open="isModalVisible"
      :title="editingEvent ? 'Edit Event' : 'Create New Event'"
      :footer="null"
      destroyOnClose
    >
      <EventForm 
        :event="editingEvent" 
        @submit="handleFormSubmit" 
        @cancel="isModalVisible = false" 
      />
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { PlusOutlined } from '@ant-design/icons-vue';
import { useEventStore } from '../../stores/useEventStore';
import EventList from '../../components/events/EventList.vue';
import EventForm from '../../components/events/EventForm.vue';

const router = useRouter();
const eventStore = useEventStore();

const searchQuery = ref('');
const statusFilter = ref('all');
const isModalVisible = ref(false);
const editingEvent = ref(null);

const isLoading = computed(() => eventStore.isLoading);

const filteredEvents = computed(() => {
  return eventStore.events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          (event.location && event.location.toLowerCase().includes(searchQuery.value.toLowerCase()));
    
    const matchesStatus = statusFilter.value === 'all' || event.status === statusFilter.value;
    
    return matchesSearch && matchesStatus;
  });
});

onMounted(() => {
  eventStore.fetchEvents();
});

const handleCreate = () => {
  editingEvent.value = null;
  isModalVisible.value = true;
};

const handleView = (event) => {
  router.push(`/events/${event.id}`);
};

const handleEdit = (event) => {
  editingEvent.value = event;
  isModalVisible.value = true;
};

const handleFormSubmit = () => {
  isModalVisible.value = false;
  eventStore.fetchEvents();
};

const handleDelete = async (eventId) => {
  await eventStore.deleteEvent(eventId);
};
</script>

<style>
.custom-search .ant-input-wrapper {
  border-radius: 8px;
  overflow: hidden;
}
</style>
