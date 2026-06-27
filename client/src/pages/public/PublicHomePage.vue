<template>
  <div class="public-home-page">
    <div class="hero">
      <h1>Welcome to {{ appName }}</h1>
      <p>Smart Event Check-in System</p>
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

<style scoped>
.public-home-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  margin-bottom: 48px;
}

.hero h1 {
  font-size: 48px;
  font-weight: bold;
  margin: 0 0 16px 0;
  color: #1890ff;
}

.hero p {
  font-size: 20px;
  color: #666;
  margin: 0;
}
</style>
