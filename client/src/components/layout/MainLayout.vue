<template>
  <a-layout class="min-h-screen bg-slate-50">
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      class="!bg-navy-900 shadow-2xl z-20"
      width="260"
    >
      <div class="h-20 flex items-center justify-center border-b border-white/10 mx-4">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
            <ScanOutlined class="text-white text-lg" />
          </div>
          <h3 v-if="!collapsed" class="text-white text-lg font-semibold tracking-tight m-0 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 whitespace-nowrap">
            {{ appName }}
          </h3>
        </div>
      </div>
      
      <div class="p-4">
        <a-menu
          v-model:selectedKeys="selectedKeys"
          theme="dark"
          mode="inline"
          @click="handleMenuClick"
          class="!bg-transparent border-r-0 custom-menu"
        >
          <a-menu-item key="/" class="!rounded-xl mb-2 !flex !items-center h-12">
            <template #icon><DashboardOutlined class="text-lg" /></template>
            <span class="font-medium">Dashboard</span>
          </a-menu-item>
          <a-menu-item key="/events" class="!rounded-xl mb-2 !flex !items-center h-12">
            <template #icon><CalendarOutlined class="text-lg" /></template>
            <span class="font-medium">Events</span>
          </a-menu-item>
          <a-menu-item key="/checkin" class="!rounded-xl mb-2 !flex !items-center h-12">
            <template #icon><ScanOutlined class="text-lg" /></template>
            <span class="font-medium">Check-in</span>
          </a-menu-item>
        </a-menu>
      </div>
    </a-layout-sider>

    <a-layout class="bg-transparent">
      <a-layout-header class="!bg-white/80 backdrop-blur-lg border-b border-slate-200/50 px-6 flex items-center justify-between sticky top-0 z-10 !h-20 shadow-sm">
        <div class="flex items-center">
          <button @click="collapsed = !collapsed" class="w-10 h-10 rounded-xl bg-slate-100 hover:bg-brand-50 text-slate-600 hover:text-brand-600 flex items-center justify-center transition-colors">
            <MenuUnfoldOutlined v-if="collapsed" class="text-lg" />
            <MenuFoldOutlined v-else class="text-lg" />
          </button>
        </div>

        <div class="flex items-center">
          <a-dropdown placement="bottomRight" :trigger="['click']">
            <div class="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors border border-transparent hover:border-slate-200">
              <a-avatar size="large" class="bg-gradient-to-br from-brand-400 to-brand-600 shadow-md">
                <template #icon><UserOutlined /></template>
              </a-avatar>
              <div class="hidden md:block text-right">
                <p class="text-sm font-semibold text-slate-800 m-0 leading-tight">{{ user?.name }}</p>
                <p class="text-xs text-slate-500 m-0">{{ user?.role || 'Admin' }}</p>
              </div>
              <DownOutlined class="text-slate-400 text-xs ml-1" />
            </div>
            <template #overlay>
              <a-menu class="!p-2 !rounded-xl !shadow-xl !border !border-slate-100 w-48 mt-2">
                <div class="px-3 py-2 border-b border-slate-100 mb-2 block md:hidden">
                  <p class="text-sm font-semibold text-slate-800 m-0">{{ user?.name }}</p>
                  <p class="text-xs text-slate-500 m-0">{{ user?.role || 'Admin' }}</p>
                </div>
                <a-menu-item @click="handleLogout" class="!rounded-lg !text-red-500 hover:!bg-red-50 !flex !items-center !py-2.5">
                  <LogoutOutlined class="mr-2" />
                  <span class="font-medium">Logout</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <a-layout-content class="p-6 md:p-8 max-w-7xl mx-auto w-full">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/useAuthStore';
import {
  DashboardOutlined,
  CalendarOutlined,
  ScanOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  DownOutlined,
  LogoutOutlined,
} from '@ant-design/icons-vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const collapsed = ref(false);
const selectedKeys = ref([route.path]);
const appName = import.meta.env.VITE_APP_NAME || 'Lahn Event';

const user = computed(() => authStore.user);

watch(route, (newRoute) => {
  selectedKeys.value = [newRoute.path];
});

const handleMenuClick = ({ key }) => {
  router.push(key);
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style>
/* Custom overrides for Ant Design Menu inside the dark sidebar */
.custom-menu.ant-menu-dark .ant-menu-item {
  color: #94a3b8 !important; /* slate-400 */
}
.custom-menu.ant-menu-dark .ant-menu-item:hover {
  color: #fff !important;
  background-color: rgba(255, 255, 255, 0.1) !important;
}
.custom-menu.ant-menu-dark .ant-menu-item-selected {
  color: #fff !important;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4) !important;
}

/* Page transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
