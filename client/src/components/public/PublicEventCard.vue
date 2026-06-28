<template>
  <a-card hoverable class="mb-4">
    <template #title>
      <div class="flex items-center gap-2">
        <CalendarOutlined />
        <span>{{ event.name }}</span>
      </div>
    </template>
    <div class="[&_p]:my-2 [&_p]:flex [&_p]:items-center [&_p]:gap-2 [&_p]:text-slate-500">
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
