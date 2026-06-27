<template>
  <div class="glass-card rounded-2xl p-6 h-full">
    <h3 class="text-lg font-bold text-slate-800 mb-6 flex items-center">
      <ThunderboltOutlined class="text-amber-500 mr-2" />
      Quick Actions
    </h3>
    
    <div class="space-y-4">
      <button 
        @click="goToEvents"
        class="w-full group relative overflow-hidden rounded-xl p-4 text-left transition-all duration-300 hover:shadow-md border border-slate-100 hover:border-brand-200 bg-white hover:bg-brand-50"
      >
        <div class="flex items-center gap-4 relative z-10">
          <div class="w-10 h-10 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <PlusOutlined />
          </div>
          <div>
            <h4 class="font-semibold text-slate-800 m-0 group-hover:text-brand-700 transition-colors">Create Event</h4>
            <p class="text-xs text-slate-500 m-0 mt-1">Set up a new event</p>
          </div>
        </div>
      </button>

      <button 
        @click="goToVisitors"
        class="w-full group relative overflow-hidden rounded-xl p-4 text-left transition-all duration-300 hover:shadow-md border border-slate-100 hover:border-indigo-200 bg-white hover:bg-indigo-50"
      >
        <div class="flex items-center gap-4 relative z-10">
          <div class="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <TeamOutlined />
          </div>
          <div>
            <h4 class="font-semibold text-slate-800 m-0 group-hover:text-indigo-700 transition-colors">Manage Visitors</h4>
            <p class="text-xs text-slate-500 m-0 mt-1">View all registrations</p>
          </div>
        </div>
      </button>

      <button 
        @click="goToCheckIn"
        class="w-full group relative overflow-hidden rounded-xl p-4 text-left transition-all duration-300 hover:shadow-md border border-slate-100 hover:border-emerald-200 bg-white hover:bg-emerald-50"
      >
        <div class="flex items-center gap-4 relative z-10">
          <div class="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ScanOutlined />
          </div>
          <div>
            <h4 class="font-semibold text-slate-800 m-0 group-hover:text-emerald-700 transition-colors">Scanner Mode</h4>
            <p class="text-xs text-slate-500 m-0 mt-1">Launch check-in scanner</p>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { 
  ThunderboltOutlined,
  PlusOutlined, 
  TeamOutlined, 
  ScanOutlined 
} from '@ant-design/icons-vue';

const router = useRouter();

const goToEvents = () => {
  router.push('/events');
};

const goToVisitors = () => {
  router.push('/events'); // Change this to a generic visitors page if it exists later
};

const goToCheckIn = () => {
  router.push('/checkin');
};
</script>
