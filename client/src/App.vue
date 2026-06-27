<template>
  <a-config-provider :theme="themeConfig">
    <component :is="layoutComponent">
      <router-view />
    </component>
  </a-config-provider>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from './stores/useAuthStore';
import MainLayout from './components/layout/MainLayout.vue';
import AuthLayout from './components/layout/AuthLayout.vue';
import PublicLayout from './components/layout/PublicLayout.vue';

const route = useRoute();
const authStore = useAuthStore();

const themeConfig = {
  token: {
    colorPrimary: '#3b82f6', // brand-500
    colorInfo: '#3b82f6',
    colorSuccess: '#10b981', // emerald-500
    colorWarning: '#f59e0b', // amber-500
    colorError: '#ef4444', // red-500
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    borderRadius: 8,
    wireframe: false,
  },
};

const layoutComponent = computed(() => {
  const layout = route.meta.layout || 'main';
  switch (layout) {
    case 'auth':
      return AuthLayout;
    case 'public':
      return PublicLayout;
    default:
      return MainLayout;
  }
});

// Initialize auth state from localStorage when app mounts
onMounted(() => {
  authStore.checkAuth();
});
</script>