<template>
  <a-card hoverable class="public-event-card">
    <template #title>
      <div class="card-title">
        <CalendarOutlined />
        <span>{{ event.name }}</span>
      </div>
    </template>
    <div class="event-details">
      <p><EnvironmentOutlined /> {{ event.location }}</p>
      <p><ClockCircleOutlined /> {{ formatDate(event.date) }}</p>
      <p><UserOutlined /> {{ event.registered_count || 0 }} registered</p>
    </div>
    <template #actions>
      <a-button type="primary" block @click="handleRegister">
        Register
      </a-button>
    </template>
  </a-card>
</template>

<script setup>
import { CalendarOutlined, EnvironmentOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['register']);

const formatDate = (date) => {
  return dayjs(date).format('MMM DD, YYYY HH:mm');
};

const handleRegister = () => {
  emit('register', props.event.id);
};
</script>

<style scoped>
.public-event-card {
  margin-bottom: 16px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.event-details p {
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
}
</style>
