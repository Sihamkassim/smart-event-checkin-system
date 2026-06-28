<template>
  <div class="p-6 max-w-[1200px] mx-auto">
    <div class="text-center mb-12">
      <h1 class="text-5xl font-bold mb-4 text-blue-500">Welcome to {{ appName }}</h1>
      <p class="text-xl text-slate-500 m-0">Smart Event Check-in System</p>
    </div>
    <PublicEventList @register="handleRegister" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import PublicEventList from '../../components/public/PublicEventList.vue';

const router = useRouter();
const appName = import.meta.env.VITE_APP_NAME || 'Event Check-in System';

const handleRegister = (eventId) => {
  router.push(`/public/register/${eventId}`);
};
</script>
