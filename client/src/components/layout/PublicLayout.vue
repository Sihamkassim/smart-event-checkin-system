<template>
  <div class="public-layout">
    <a-layout class="min-h-screen">
      <a-layout-header class="!bg-white !shadow-sm">
        <div class="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-16">
          <h1 class="m-0 text-xl font-bold">{{ appName }}</h1>
          <a-button type="link" @click="goToLogin">
            Login
          </a-button>
        </div>
      </a-layout-header>
      <a-layout-content class="bg-slate-50 min-h-[calc(100vh-128px)]">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="text-center !bg-white">
        {{ appName }} © {{ new Date().getFullYear() }}
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const appName = import.meta.env.VITE_APP_NAME || 'Event Check-in System';

const goToLogin = () => {
  router.push('/login');
};
</script>
