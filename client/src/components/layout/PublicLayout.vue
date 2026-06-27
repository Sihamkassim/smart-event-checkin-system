<template>
  <div class="public-layout">
    <a-layout class="min-h-screen">
      <a-layout-header class="header">
        <div class="header-content">
          <h1>{{ appName }}</h1>
          <a-button type="link" @click="goToLogin">
            Login
          </a-button>
        </div>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
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

<style scoped>
.header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.header-content h1 {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
}

.content {
  background: #f5f5f5;
  min-height: calc(100vh - 128px);
}

.footer {
  text-align: center;
  background: #fff;
}
</style>
