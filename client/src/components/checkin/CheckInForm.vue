<template>
  <div>
    <!-- Event Selector -->
    <div class="mb-8" v-if="!selectedEvent">
      <h3 class="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <CalendarOutlined class="text-brand-500" /> Select Event
      </h3>
      <a-select
        v-model:value="selectedEventId"
        show-search
        placeholder="Search and select an active event"
        class="w-full custom-select"
        size="large"
        :options="eventOptions"
        :filter-option="filterOption"
        @change="handleEventChange"
      >
        <template #suffixIcon><SearchOutlined class="text-slate-400" /></template>
      </a-select>
    </div>

    <div v-else class="space-y-8">
      <!-- Active Event Header -->
      <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
        <div>
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Active Terminal</p>
          <h4 class="text-base font-bold text-slate-800 m-0">{{ selectedEvent.name }}</h4>
        </div>
        <a-button type="link" @click="changeEvent" class="text-slate-500 hover:text-brand-500">
          Change Event
        </a-button>
      </div>

      <!-- Scanner Area -->
      <div class="relative">
        <div class="absolute -inset-4 bg-gradient-to-r from-brand-500 to-indigo-500 opacity-10 rounded-[2rem] blur-xl"></div>
        <div class="relative bg-white border-2 border-dashed border-slate-200 rounded-2xl p-8 md:p-12 text-center transition-colors hover:border-brand-300">
          <div class="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <div class="absolute inset-0 border-4 border-brand-500 rounded-full animate-ping opacity-20"></div>
            <ScanOutlined class="text-4xl text-brand-500" />
          </div>
          
          <h3 class="text-xl font-bold text-slate-800 mb-2">Ready to Scan</h3>
          <p class="text-slate-500 mb-8 max-w-sm mx-auto">Focus the QR code inside the camera area or enter the token manually below.</p>
          
          <div class="max-w-xs mx-auto relative">
            <a-input
              v-model:value="token"
              placeholder="Enter check-in token (e.g. TKN-...)"
              size="large"
              class="text-center font-mono text-lg tracking-wider custom-token-input"
              @pressEnter="handleCheckIn"
              :disabled="isLoading"
            >
              <template #prefix>
                <KeyOutlined class="text-slate-400 mr-1" />
              </template>
            </a-input>
            
            <a-button 
              type="primary" 
              class="w-full mt-4 h-12 text-base font-semibold bg-brand-500 hover:bg-brand-600 rounded-xl shadow-lg shadow-brand-500/30"
              @click="handleCheckIn" 
              :loading="isLoading"
              :disabled="!token"
            >
              Verify Token
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { useEventStore } from '../../stores/useEventStore';
import { useVisitorStore } from '../../stores/useVisitorStore';
import { 
  CalendarOutlined, 
  SearchOutlined, 
  ScanOutlined,
  KeyOutlined 
} from '@ant-design/icons-vue';

const route = useRoute();
const eventStore = useEventStore();
const visitorStore = useVisitorStore();

const selectedEventId = ref(null);
const token = ref('');
const isLoading = ref(false);

const eventOptions = computed(() => {
  return eventStore.events
    .filter(e => e.status !== 'completed')
    .map(e => ({
      value: e.id,
      label: e.name,
    }));
});

const selectedEvent = computed(() => {
  if (!selectedEventId.value) return null;
  return eventStore.events.find(e => e.id === selectedEventId.value);
});

const filterOption = (input, option) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const handleEventChange = (value) => {
  selectedEventId.value = value;
};

const changeEvent = () => {
  selectedEventId.value = null;
  token.value = '';
};

const handleCheckIn = async () => {
  if (!token.value.trim() || !selectedEventId.value) return;
  
  isLoading.value = true;
  try {
    const success = await visitorStore.checkInVisitor(selectedEventId.value, token.value.trim());
    if (success) {
      token.value = '';
      // Event stats will be updated next time they are needed
    }
  } catch (error) {
    // Error is handled by the store
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await eventStore.fetchEvents();
  
  // Auto-select event from URL query
  if (route.query.event) {
    const id = parseInt(route.query.event);
    if (eventStore.events.some(e => e.id === id)) {
      selectedEventId.value = id;
    }
  }
});
</script>

<style>
.custom-select .ant-select-selector {
  border-radius: 8px !important;
  height: 40px !important;
  align-items: center;
}
.custom-token-input {
  border-radius: 12px;
}
.custom-token-input input {
  text-align: center;
  font-family: monospace;
  font-weight: 600;
  letter-spacing: 2px;
}
</style>
