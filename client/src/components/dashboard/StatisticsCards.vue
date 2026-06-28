<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Total Events -->
    <div class="glass-card rounded-2xl p-6 relative overflow-hidden group">
      <div class="absolute -right-4 -top-4 w-24 h-24 bg-brand-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
      <div class="relative z-10 flex items-start justify-between">
        <div>
          <p class="text-sm font-medium text-slate-500 mb-1">Total Events</p>
          <h3 class="text-3xl font-bold text-slate-800">{{ stats.totalEvents || 0 }}</h3>
        </div>
        <div class="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center shadow-sm">
          <CalendarOutlined class="text-xl" />
        </div>
      </div>
    </div>

    <!-- Total Visitors -->
    <div class="glass-card rounded-2xl p-6 relative overflow-hidden group">
      <div class="absolute -right-4 -top-4 w-24 h-24 bg-indigo-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
      <div class="relative z-10 flex items-start justify-between">
        <div>
          <p class="text-sm font-medium text-slate-500 mb-1">Total Visitors</p>
          <h3 class="text-3xl font-bold text-slate-800">{{ stats.totalVisitors || 0 }}</h3>
        </div>
        <div class="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm">
          <TeamOutlined class="text-xl" />
        </div>
      </div>
    </div>

    <!-- Checked In -->
    <div class="glass-card rounded-2xl p-6 relative overflow-hidden group">
      <div class="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
      <div class="relative z-10 flex items-start justify-between">
        <div>
          <p class="text-sm font-medium text-slate-500 mb-1">Checked In</p>
          <h3 class="text-3xl font-bold text-slate-800">{{ stats.checkedIn || 0 }}</h3>
          <p class="text-xs font-medium text-emerald-500 mt-2 flex items-center">
            <span class="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
            {{ checkInPercentage }}% completion
          </p>
        </div>
        <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
          <CheckCircleOutlined class="text-xl" />
        </div>
      </div>
    </div>

    <!-- Pending -->
    <div class="glass-card rounded-2xl p-6 relative overflow-hidden group">
      <div class="absolute -right-4 -top-4 w-24 h-24 bg-amber-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
      <div class="relative z-10 flex items-start justify-between">
        <div>
          <p class="text-sm font-medium text-slate-500 mb-1">Pending Check-in</p>
          <h3 class="text-3xl font-bold text-slate-800">{{ stats.pending || 0 }}</h3>
        </div>
        <div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-sm">
          <ClockCircleOutlined class="text-xl" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import {
  CalendarOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons-vue';

const props = defineProps({
  stats: {
    type: Object,
    required: true,
    default: () => ({
      totalEvents: 0,
      totalVisitors: 0,
      checkedIn: 0,
      pending: 0,
    }),
  },
});

const checkInPercentage = computed(() => {
  if (!props.stats.totalVisitors) return 0;
  return Math.round((props.stats.checkedIn / props.stats.totalVisitors) * 100);
});
</script>
