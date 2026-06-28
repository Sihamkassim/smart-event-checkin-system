<template>
  <div class="glass-card rounded-2xl p-6 h-full">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-bold text-slate-800 m-0">Recent Check-ins</h3>
      <a-button type="link" @click="$router.push('/events')" class="text-brand-600 hover:text-brand-700">
        View All
      </a-button>
    </div>

    <div v-if="loading" class="flex justify-center py-8">
      <a-spin />
    </div>

    <div v-else-if="!checkIns?.length" class="text-center py-12">
      <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
        <InboxOutlined class="text-2xl text-slate-400" />
      </div>
      <p class="text-slate-500">No check-ins today yet</p>
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="visitor in checkIns" 
        :key="visitor.id"
        class="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors"
      >
        <div class="flex items-center gap-4">
          <a-avatar 
            :size="48" 
            :style="{ backgroundColor: getAvatarColor(visitor.full_name) }"
            class="shadow-sm font-semibold text-lg"
          >
            {{ visitor.full_name.charAt(0).toUpperCase() }}
          </a-avatar>
          
          <div>
            <h4 class="font-semibold text-slate-800 m-0">{{ visitor.full_name }}</h4>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-xs text-slate-500 flex items-center">
                <IdcardOutlined class="mr-1" /> {{ visitor.check_in_token }}
              </span>
            </div>
          </div>
        </div>

        <div class="text-right">
          <div class="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 mb-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
            <span class="text-xs font-medium text-emerald-700">Checked In</span>
          </div>
          <p class="text-xs text-slate-400 m-0">{{ formatTime(visitor.checked_in_at) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { InboxOutlined, IdcardOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';

defineProps({
  checkIns: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const formatTime = (time) => {
  if (!time) return '';
  return dayjs(time).format('MMM D, YYYY h:mm A');
};

const getAvatarColor = (name) => {
  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};
</script>
