<template>
  <div 
    class="inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium uppercase tracking-wider"
    :class="{
      'bg-emerald-50 border-emerald-200 text-emerald-700': status === 'active' || status === true || status === 'checked_in',
      'bg-amber-50 border-amber-200 text-amber-700': status === 'upcoming' || status === false || status === 'pending',
      'bg-slate-100 border-slate-200 text-slate-700': status === 'completed',
    }"
  >
    <span 
      class="w-1.5 h-1.5 rounded-full mr-1.5"
      :class="{
        'bg-emerald-500': status === 'active' || status === true || status === 'checked_in',
        'bg-amber-500': status === 'upcoming' || status === false || status === 'pending',
        'bg-slate-500': status === 'completed',
      }"
    ></span>
    {{ formattedStatus }}
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: {
    type: [String, Boolean],
    required: true,
  },
});

const formattedStatus = computed(() => {
  if (props.status === true || props.status === 'checked_in') return 'Checked In';
  if (props.status === false || props.status === 'pending') return 'Pending';
  return String(props.status);
});
</script>
