<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
        <p class="text-slate-500 mt-1">Here's what's happening with your events today.</p>
      </div>
      
      <!-- Date Display -->
      <div class="hidden sm:flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
        <CalendarOutlined class="text-brand-500" />
        <span class="text-sm font-medium text-slate-600">{{ currentDate }}</span>
      </div>
    </div>

    <!-- Loading State -->
    <LoadingSpinner v-if="isLoading" text="Loading dashboard data..." />

    <!-- Dashboard Content -->
    <div v-else class="space-y-6">
      <StatisticsCards :stats="dashboardStats" />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div class="lg:col-span-2" v-if="user?.role === 'admin'">
          <LatestCheckIns :check-ins="latestCheckIns" />
        </div>
        <div :class="{'lg:col-span-3': user?.role !== 'admin'}">
          <QuickActions />
        </div>
      </div>
      <AiAssistantWidget v-if="user?.role === 'admin'" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuth } from '../../composables/useAuth';
import { useStatsStore } from '../../stores/useStatsStore';
import StatisticsCards from '../../components/dashboard/StatisticsCards.vue';
import LatestCheckIns from '../../components/dashboard/LatestCheckIns.vue';
import QuickActions from '../../components/dashboard/QuickActions.vue';
import AiAssistantWidget from '../../components/dashboard/AiAssistantWidget.vue';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';
import { CalendarOutlined } from '@ant-design/icons-vue';

const { user } = useAuth();
const statsStore = useStatsStore();

const isLoading = computed(() => statsStore.isLoading);

const currentDate = computed(() => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());
});

const latestCheckIns = computed(() => {
  if (!statsStore.globalStats || !statsStore.globalStats.latest_check_ins) return [];
  return statsStore.globalStats.latest_check_ins.map(c => ({
    full_name: c.visitor?.full_name || 'Unknown',
    company: c.visitor?.company,
    checked_in_at: c.checked_in_at,
    status: 'success'
  }));
});

const dashboardStats = computed(() => {
  if (!statsStore.globalStats) return { totalEvents: 0, totalVisitors: 0, checkedIn: 0, pending: 0 };
  return {
    totalEvents: statsStore.globalStats.total_events || 0,
    totalVisitors: statsStore.globalStats.total_visitors || 0,
    checkedIn: statsStore.globalStats.checked_in || 0,
    pending: statsStore.globalStats.not_checked_in || 0,
  };
});

onMounted(async () => {
  await statsStore.fetchGlobalStats();
});
</script>
