<template>
  <a-layout class="min-h-screen bg-slate-50">
    <!-- Mobile Drawer -->
    <a-drawer
      v-model:open="mobileDrawerOpen"
      placement="left"
      :closable="false"
      :width="260"
      class="!p-0"
    >
      <div class="flex flex-col h-full bg-white">
        <div class="h-20 flex-shrink-0 flex items-center justify-center border-b border-slate-100 mx-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <ScanOutlined class="text-white text-lg" />
            </div>
            <h3 class="text-slate-800 text-lg font-bold tracking-tight m-0 whitespace-nowrap">
              {{ appName }}
            </h3>
          </div>
        </div>
        
        <div class="p-4 flex-1 overflow-y-auto">
          <a-menu
            v-model:selectedKeys="selectedKeys"
            theme="light"
            mode="inline"
            @click="handleMenuClick"
            class="custom-menu !bg-transparent border-r-0"
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
            <a-menu-item v-if="user?.role === 'admin'" key="/staff" class="!rounded-xl mb-2 !flex !items-center h-12">
              <template #icon><TeamOutlined class="text-lg" /></template>
              <span class="font-medium">Staff</span>
            </a-menu-item>
          </a-menu>
        </div>

        <div class="p-4 border-t border-slate-200 mt-auto flex-shrink-0 bg-slate-50/50">
          <a-dropdown placement="topRight" :trigger="['click']">
            <div class="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-200 cursor-pointer transition-colors w-full">
              <a-avatar size="large" class="bg-gradient-to-br from-brand-400 to-brand-600 shadow-md flex-shrink-0">
                <template #icon><UserOutlined /></template>
              </a-avatar>
              <div class="overflow-hidden flex-1">
                <p class="text-sm font-semibold text-slate-800 m-0 leading-tight truncate">{{ user?.name }}</p>
                <p class="text-xs text-slate-500 m-0 capitalize truncate">{{ user?.role || 'admin' }}</p>
              </div>
              <DownOutlined class="text-slate-400 text-xs flex-shrink-0" />
            </div>
            <template #overlay>
              <a-menu class="!p-2 !rounded-xl !shadow-xl !border !border-slate-100 w-48 mb-2">
                <a-menu-item @click="handleLogout" class="!rounded-lg !text-red-500 hover:!bg-red-50 !flex !items-center !py-2.5">
                  <LogoutOutlined class="mr-2" />
                  <span class="font-medium">Logout</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
    </a-drawer>

    <!-- Desktop Sidebar -->
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      class="!bg-white border-r border-slate-200 z-50 shadow-sm hidden md:block"
      :style="{ overflow: 'hidden', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }"
      width="260"
    >
      <div class="flex flex-col h-full">
        <div class="h-20 flex-shrink-0 flex items-center justify-center border-b border-slate-100 mx-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <ScanOutlined class="text-white text-lg" />
            </div>
            <h3 v-if="!collapsed" class="text-slate-800 text-lg font-bold tracking-tight m-0 whitespace-nowrap">
              {{ appName }}
            </h3>
          </div>
        </div>
        
        <div class="p-4 flex-1 overflow-y-auto">
          <a-menu
            v-model:selectedKeys="selectedKeys"
            theme="light"
            mode="inline"
            @click="handleMenuClick"
            class="custom-menu !bg-transparent border-r-0"
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
            <a-menu-item v-if="user?.role === 'admin'" key="/staff" class="!rounded-xl mb-2 !flex !items-center h-12">
              <template #icon><TeamOutlined class="text-lg" /></template>
              <span class="font-medium">Staff</span>
            </a-menu-item>
          </a-menu>
        </div>

        <div class="p-4 border-t border-slate-200 mt-auto flex-shrink-0 bg-slate-50/50">
          <a-dropdown placement="topRight" :trigger="['click']">
            <div class="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-200 cursor-pointer transition-colors w-full" :class="{'justify-center': collapsed}">
              <a-avatar size="large" class="bg-gradient-to-br from-brand-400 to-brand-600 shadow-md flex-shrink-0">
                <template #icon><UserOutlined /></template>
              </a-avatar>
              <div class="overflow-hidden flex-1" v-if="!collapsed">
                <p class="text-sm font-semibold text-slate-800 m-0 leading-tight truncate">{{ user?.name }}</p>
                <p class="text-xs text-slate-500 m-0 capitalize truncate">{{ user?.role || 'admin' }}</p>
              </div>
              <DownOutlined class="text-slate-400 text-xs flex-shrink-0" v-if="!collapsed" />
            </div>
            <template #overlay>
              <a-menu class="!p-2 !rounded-xl !shadow-xl !border !border-slate-100 w-48 mb-2">
                <a-menu-item @click="handleLogout" class="!rounded-lg !text-red-500 hover:!bg-red-50 !flex !items-center !py-2.5">
                  <LogoutOutlined class="mr-2" />
                  <span class="font-medium">Logout</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
    </a-layout-sider>

    <a-layout class="bg-transparent flex-1 w-full min-w-0 transition-all duration-200 ease-in-out md:ml-0" :style="{ marginLeft: isMobile ? 0 : (collapsed ? '80px' : '260px') }">
      <a-layout-header class="!bg-white/80 backdrop-blur-lg border-b border-slate-200/50 px-6 flex items-center justify-between sticky top-0 z-10 !h-20 shadow-sm">
        <div class="flex items-center">
          <!-- Mobile Hamburger -->
          <button @click="mobileDrawerOpen = true" class="md:hidden w-10 h-10 rounded-xl bg-slate-100 hover:bg-brand-50 text-slate-600 hover:text-brand-600 flex items-center justify-center transition-colors mr-3">
            <MenuOutlined class="text-lg" />
          </button>
          <!-- Desktop Collapse Button -->
          <button @click="collapsed = !collapsed" class="hidden md:block w-10 h-10 rounded-xl bg-slate-100 hover:bg-brand-50 text-slate-600 hover:text-brand-600 flex items-center justify-center transition-colors">
            <MenuUnfoldOutlined v-if="collapsed" class="text-lg" />
            <MenuFoldOutlined v-else class="text-lg" />
          </button>
        </div>
      </a-layout-header>

      <a-layout-content class="p-6 md:p-8 max-w-7xl mx-auto w-full">
        <router-view v-slot="{ Component }">
          <transition 
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-2"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/useAuthStore';
import {
  DashboardOutlined,
  CalendarOutlined,
  ScanOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  UserOutlined,
  DownOutlined,
  LogoutOutlined,
  TeamOutlined,
} from '@ant-design/icons-vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const collapsed = ref(false);
const mobileDrawerOpen = ref(false);
const isMobile = ref(false);

const appName = computed(() => import.meta.env.VITE_APP_NAME || 'Smart Event Check-in');

const getActiveKey = (path) => {
  if (path.startsWith('/events')) return '/events';
  if (path.startsWith('/checkin')) return '/checkin';
  if (path.startsWith('/staff')) return '/staff';
  return '/';
};

const selectedKeys = ref([getActiveKey(route.path)]);

const user = computed(() => authStore.user);

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

watch(route, (newRoute) => {
  selectedKeys.value = [getActiveKey(newRoute.path)];
  // Close mobile drawer on route change
  if (isMobile.value) {
    mobileDrawerOpen.value = false;
  }
});

const handleMenuClick = ({ key }) => {
  router.push(key);
  if (isMobile.value) {
    mobileDrawerOpen.value = false;
  }
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style>
/* Custom overrides for Ant Design Menu inside the light sidebar */
.custom-menu.ant-menu-light .ant-menu-item {
  color: #64748b !important; /* slate-500 */
}
.custom-menu.ant-menu-light .ant-menu-item:hover {
  color: #3b82f6 !important;
  background-color: #f1f5f9 !important; /* slate-100 */
}
.custom-menu.ant-menu-light .ant-menu-item-selected {
  color: #fff !important;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2) !important;
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
