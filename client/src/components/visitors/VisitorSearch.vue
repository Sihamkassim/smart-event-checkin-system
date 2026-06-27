<template>
  <div class="visitor-search">
    <a-input-search
      v-model:value="searchQuery"
      placeholder="Search visitors by name, email, or phone"
      size="large"
      @search="handleSearch"
      @change="handleSearchChange"
      :loading="isLoading"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  eventId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['search']);

const searchQuery = ref('');
const isLoading = ref(false);

const handleSearch = async () => {
  if (searchQuery.value.trim()) {
    isLoading.value = true;
    emit('search', searchQuery.value);
    isLoading.value = false;
  }
};

const handleSearchChange = (e) => {
  if (!e.target.value.trim()) {
    emit('search', '');
  }
};
</script>

<style scoped>
.visitor-search {
  margin-bottom: 16px;
}
</style>
