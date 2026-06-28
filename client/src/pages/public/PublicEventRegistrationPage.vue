<template>
  <div class="p-6 max-w-[600px] mx-auto">
    <div class="mb-6">
      <a-button @click="goBack">
        <template #icon>
          <ArrowLeftOutlined />
        </template>
        Back to Events
      </a-button>
    </div>
    <PublicRegistrationForm :event-id="eventId" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PublicRegistrationForm from '../../components/public/PublicRegistrationForm.vue';
import { ArrowLeftOutlined } from '@ant-design/icons-vue';

const route = useRoute();
const router = useRouter();

const eventId = computed(() => parseInt(route.params.id));

const goBack = () => {
  router.push('/public');
};
</script>
