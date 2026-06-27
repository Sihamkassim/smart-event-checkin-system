<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div class="flex items-center gap-4">
        <a-button @click="goBack" shape="circle" size="large" class="border-slate-200 hover:border-brand-500 hover:text-brand-500">
          <template #icon><ArrowLeftOutlined /></template>
        </a-button>
        <div>
          <h1 class="text-2xl font-bold text-slate-800 tracking-tight m-0">{{ event?.name || 'Loading Event...' }}</h1>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-sm text-slate-500 flex items-center">
              <CalendarOutlined class="mr-1" /> {{ formatDate(event?.start_date) }}
            </span>
            <span class="text-slate-300">•</span>
            <VisitorStatusBadge v-if="event?.status" :status="event.status" />
          </div>
        </div>
      </div>
      
      <div class="flex gap-3">
        <a-button 
          v-if="user?.role === 'admin'"
          size="large" 
          @click="handleEdit" 
          class="rounded-lg"
        >
          <template #icon><EditOutlined /></template>
          Edit Event
        </a-button>
        <a-button 
          v-if="canCheckIn"
          type="primary" 
          size="large" 
          @click="goToCheckIn" 
          class="bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-md shadow-emerald-500/20"
        >
          <template #icon><ScanOutlined /></template>
          Scanner Mode
        </a-button>
      </div>
    </div>

    <LoadingSpinner v-if="isLoading" text="Loading event details..." />

    <template v-else-if="event">
      <div v-if="event.image_url" class="w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-6 shadow-sm">
        <img :src="`http://localhost:5000${event.image_url}`" :alt="event.name" class="w-full h-full object-cover" />
      </div>

      <EventStatsCards :stats="eventStats" />
      
      <!-- Main Content Tabs -->
      <div class="glass-card rounded-2xl overflow-hidden mt-6">
        <a-tabs v-model:activeKey="activeTab" class="custom-tabs px-6 pt-4">
          
          <!-- Visitors Tab -->
          <a-tab-pane key="visitors">
            <template #tab>
              <span class="flex items-center gap-2 text-base">
                <TeamOutlined /> Visitors
              </span>
            </template>
            <div class="py-4">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-slate-800">Attendee List</h3>
                <div class="flex gap-2">
                  <a-button 
                    v-if="canManageVisitors"
                    @click="showBulkImport = true" 
                    class="rounded-lg border-brand-200 text-brand-600 hover:border-brand-500 hover:text-brand-500"
                  >
                    <template #icon><UploadOutlined /></template>
                    Import CSV/Excel
                  </a-button>
                  <a-button 
                    v-if="canManageVisitors"
                    @click="exportVisitorsCsv" 
                    class="rounded-lg border-brand-200 text-brand-600 hover:border-brand-500 hover:text-brand-500"
                    :loading="isExporting"
                  >
                    <template #icon><DownloadOutlined /></template>
                    Export CSV
                  </a-button>
                  <a-button 
                    v-if="canManageVisitors"
                    type="primary" 
                    @click="showAddVisitor = true" 
                    class="bg-brand-500 hover:bg-brand-600 rounded-lg"
                  >
                    <template #icon><UserAddOutlined /></template>
                    Add Visitor
                  </a-button>
                </div>
              </div>
              <VisitorList :event-id="event.id" />
            </div>
          </a-tab-pane>

          <!-- Details Tab -->
          <a-tab-pane key="details">
            <template #tab>
              <span class="flex items-center gap-2 text-base">
                <InfoCircleOutlined /> Event Details
              </span>
            </template>
            <div class="py-6 max-w-3xl">
              <h3 class="text-lg font-bold text-slate-800 mb-4">Description</h3>
              <p class="text-slate-600 whitespace-pre-wrap leading-relaxed mb-8">{{ event.description || 'No description provided.' }}</p>
              
              <h3 class="text-lg font-bold text-slate-800 mb-4">Location</h3>
              <div class="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <EnvironmentOutlined class="text-xl text-brand-500 mt-0.5" />
                <p class="text-slate-700 m-0">{{ event.location || 'Location not specified.' }}</p>
              </div>
            </div>
          </a-tab-pane>
          
        </a-tabs>
      </div>
    </template>
    
    <!-- Add Visitor Modal -->
    <a-modal v-model:open="showAddVisitor" title="Add New Visitor" :footer="null">
      <VisitorForm :event-id="event?.id" @success="handleVisitorAdded" @cancel="showAddVisitor = false" />
    </a-modal>

    <!-- Edit Event Modal -->
    <a-modal
      v-model:open="showEditEvent"
      title="Edit Event"
      :footer="null"
      destroyOnClose
    >
      <EventForm 
        :event="event" 
        @submit="handleEventEdited" 
        @cancel="showEditEvent = false" 
      />
    </a-modal>

    <!-- Bulk Import Modal -->
    <a-modal 
      v-model:open="showBulkImport" 
      title="Import Visitors" 
      :footer="null" 
      destroyOnClose 
      width="600px"
    >
      <BulkImportModal 
        :event-id="event?.id" 
        @success="handleBulkImported" 
        @cancel="showBulkImport = false" 
      />
    </a-modal>

    <!-- Event AI Assistant -->
    <AiAssistantWidget v-if="canUseAi && event" :event-id="event.id" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useEventStore } from '../../stores/useEventStore';
import { useAuthStore } from '../../stores/useAuthStore';
import EventStatsCards from '../../components/events/EventStatsCards.vue';
import VisitorList from '../../components/visitors/VisitorList.vue';
import VisitorForm from '../../components/visitors/VisitorForm.vue';
import VisitorStatusBadge from '../../components/visitors/VisitorStatusBadge.vue';
import EventForm from '../../components/events/EventForm.vue';
import { useVisitorStore } from '../../stores/useVisitorStore';
import BulkImportModal from '../../components/visitors/BulkImportModal.vue';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';
import AiAssistantWidget from '../../components/dashboard/AiAssistantWidget.vue';
import { 
  ArrowLeftOutlined, 
  CalendarOutlined, 
  EditOutlined,
  ScanOutlined,
  TeamOutlined,
  InfoCircleOutlined,
  EnvironmentOutlined,
  UserAddOutlined,
  UploadOutlined,
  DownloadOutlined
} from '@ant-design/icons-vue';
import dayjs from 'dayjs';

const route = useRoute();
const router = useRouter();
const eventStore = useEventStore();
const authStore = useAuthStore();
const visitorStore = useVisitorStore();

const activeTab = ref('visitors');
const showAddVisitor = ref(false);
const showEditEvent = ref(false);
const showBulkImport = ref(false);
const isExporting = ref(false);

const user = computed(() => authStore.user);
const event = computed(() => eventStore.currentEvent);
const eventStats = computed(() => eventStore.eventStats || {});
const isLoading = computed(() => eventStore.isLoading);

const canCheckIn = computed(() => user.value?.role === 'admin' || user.value?.permissions?.includes('checkin'));
const canManageVisitors = computed(() => user.value?.role === 'admin' || user.value?.permissions?.includes('manage_visitors'));
const canUseAi = computed(() => user.value?.role === 'admin' || user.value?.permissions?.includes('use_ai'));

const formatDate = (dateString) => {
  if (!dateString) return '';
  return dayjs(dateString).format('MMM D, YYYY h:mm A');
};

const goBack = () => {
  router.push('/events');
};

const handleEdit = () => {
  showEditEvent.value = true;
};

const goToCheckIn = () => {
  router.push({ path: '/checkin', query: { event: event.value.id } });
};

const handleVisitorAdded = () => {
  showAddVisitor.value = false;
  // Refresh stats
  eventStore.fetchEventStats(route.params.id);
};

const handleBulkImported = () => {
  showBulkImport.value = false;
  // Refresh stats to reflect new visitors
  eventStore.fetchEventStats(route.params.id);
};

const handleEventEdited = () => {
  showEditEvent.value = false;
  eventStore.fetchEventById(route.params.id);
};

const exportVisitorsCsv = async () => {
  if (!event.value?.id) return;
  try {
    isExporting.value = true;
    await visitorStore.exportVisitors(event.value.id);
  } catch (error) {
    console.error('Export failed:', error);
  } finally {
    isExporting.value = false;
  }
};

onMounted(async () => {
  const eventId = route.params.id;
  await Promise.all([
    eventStore.fetchEventById(eventId),
    eventStore.fetchEventStats(eventId),
  ]);
});
</script>

<style>
.custom-tabs .ant-tabs-nav {
  margin-bottom: 0 !important;
}
.custom-tabs .ant-tabs-nav::before {
  border-bottom: 1px solid #f1f5f9;
}
</style>
