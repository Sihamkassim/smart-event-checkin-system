<template>
  <div class="flex items-center justify-center min-h-[200px]">
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
