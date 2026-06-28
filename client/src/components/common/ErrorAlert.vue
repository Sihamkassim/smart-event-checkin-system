<template>
  <a-alert
    v-if="message"
    :message="title"
    :description="message"
    type="error"
    show-icon
    closable
    @close="handleClose"
  />
</template>

<script setup>
const props = defineProps({
  message: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: 'Error',
  },
});

const emit = defineEmits(['close']);

const handleClose = () => {
  emit('close');
};
</script>
