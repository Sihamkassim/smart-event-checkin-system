<template>
  <div class="loading-spinner">
    <a-spin :size="size" :tip="tip" />
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['small', 'default', 'large'].includes(value),
  },
  tip: {
    type: String,
    default: 'Loading...',
  },
});
</script>

<style scoped>
.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}
</style>
