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
        class="w-full [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!h-10 [&_.ant-select-selector]:items-center"
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
          
          <!-- Mode Toggle -->
          <div class="flex justify-center mb-6">
            <a-button-group class="rounded-xl overflow-hidden">
              <a-button 
                :type="scanMode === 'camera' ? 'primary' : 'default'"
                @click="scanMode = 'camera'"
                class="!rounded-none"
              >
                <CameraOutlined class="mr-2" /> Camera
              </a-button>
              <a-button 
                :type="scanMode === 'manual' ? 'primary' : 'default'"
                @click="scanMode = 'manual'"
                class="!rounded-none"
              >
                <KeyOutlined class="mr-2" /> Manual
              </a-button>
            </a-button-group>
          </div>

          <!-- Camera Scanner -->
          <div v-if="scanMode === 'camera'" class="space-y-6">
            <div id="qr-reader" class="mx-auto max-w-sm"></div>
            
            <div v-if="!isScanning" class="space-y-4">
              <p class="text-slate-500">Click below to start the camera scanner</p>
              <a-button 
                type="primary" 
                size="large"
                @click="startScanner"
                :loading="isLoading"
                class="h-12 px-8 rounded-xl"
              >
                <CameraOutlined class="mr-2" /> Start Camera
              </a-button>
            </div>

            <div v-else class="space-y-4">
              <p class="text-slate-500">Point your camera at the QR code</p>
              <a-button 
                danger 
                size="large"
                @click="stopScanner"
                class="h-12 px-8 rounded-xl"
              >
                <StopOutlined class="mr-2" /> Stop Camera
              </a-button>
            </div>
          </div>

          <!-- Manual Input -->
          <div v-else class="space-y-6">
            <div class="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <div class="absolute inset-0 border-4 border-brand-500 rounded-full animate-ping opacity-20"></div>
              <ScanOutlined class="text-4xl text-brand-500" />
            </div>
            
            <h3 class="text-xl font-bold text-slate-800 mb-2">Manual Entry</h3>
            <p class="text-slate-500 mb-4 max-w-sm mx-auto">Enter the check-in token manually.</p>
            
            <div class="max-w-xs mx-auto relative">
              <a-input
                v-model:value="token"
                placeholder="Enter check-in token (e.g. TKN-...)"
                size="large"
                class="text-center font-mono text-lg tracking-wider rounded-xl [&_input]:text-center [&_input]:font-mono [&_input]:font-semibold [&_input]:tracking-widest"
                @pressEnter="handleCheckIn"
                :disabled="isLoading"
              >
                <template #prefix>
                  <KeyOutlined class="text-slate-400 mr-1" />
                </template>
              </a-input>
            </div>
          </div>

          <!-- Verify Button (for both modes) -->
          <div class="max-w-xs mx-auto mt-6">
            <a-button 
              type="primary" 
              class="w-full h-12 text-base font-semibold bg-brand-500 hover:bg-brand-600 rounded-xl shadow-lg shadow-brand-500/30"
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { Html5Qrcode } from 'html5-qrcode';
import { useEventStore } from '../../stores/useEventStore';
import { useVisitorStore } from '../../stores/useVisitorStore';
import { 
  CalendarOutlined, 
  SearchOutlined, 
  ScanOutlined,
  KeyOutlined,
  CameraOutlined,
  StopOutlined
} from '@ant-design/icons-vue';

const route = useRoute();
const eventStore = useEventStore();
const visitorStore = useVisitorStore();

const selectedEventId = ref(null);
const token = ref('');
const isLoading = ref(false);
const scanMode = ref('manual');
const isScanning = ref(false);
let html5QrCode = null;

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
  if (isScanning.value) {
    stopScanner();
  }
};

const startScanner = async () => {
  try {
    html5QrCode = new Html5Qrcode("qr-reader");
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    
    await html5QrCode.start(
      { facingMode: "environment" },
      config,
      (decodedText) => {
        // QR code detected
        token.value = decodedText;
        message.success('QR code scanned!');
        stopScanner();
        handleCheckIn();
      },
      (errorMessage) => {
        // Scanning in progress
      }
    );
    
    isScanning.value = true;
  } catch (error) {
    message.error('Failed to start camera: ' + error.message);
  }
};

const stopScanner = async () => {
  if (html5QrCode && isScanning.value) {
    try {
      await html5QrCode.stop();
      html5QrCode.clear();
      isScanning.value = false;
    } catch (error) {
      console.error('Failed to stop scanner:', error);
    }
  }
};

const handleCheckIn = async () => {
  if (!token.value.trim() || !selectedEventId.value) return;
  
  isLoading.value = true;
  try {
    const success = await visitorStore.checkInVisitor(selectedEventId.value, token.value.trim());
    if (success) {
      token.value = '';
      message.success('Check-in successful!');
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

onUnmounted(() => {
  stopScanner();
});
</script>
