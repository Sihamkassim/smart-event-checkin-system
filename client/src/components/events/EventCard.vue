<template>
  <div 
    class="glass-card rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-300 cursor-pointer border border-slate-200/60 flex flex-col h-full bg-white"
    @click="$emit('click', event)"
  >
    <!-- Card Header / Banner -->
    <div 
      class="h-32 bg-gradient-to-br from-brand-500 to-indigo-600 relative overflow-hidden bg-cover bg-center"
      :style="event.image_url ? { backgroundImage: `url(http://localhost:5000${event.image_url})` } : {}"
    >
      <div v-if="!event.image_url" class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CgkJPGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+Cjwvc3ZnPg==')] opacity-30"></div>
      
      <!-- Status Badge & Delete Button -->
      <div class="absolute top-4 right-4 flex gap-2">
        <div 
          class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm"
          :class="{
            'bg-emerald-500/80 text-white border border-emerald-400/50': event.status === 'active',
            'bg-amber-500/80 text-white border border-amber-400/50': event.status === 'upcoming',
            'bg-slate-800/60 text-slate-200 border border-slate-600/50': event.status === 'completed'
          }"
        >
          {{ event.status }}
        </div>
        <a-popconfirm
          title="Are you sure you want to delete this event?"
          ok-text="Yes"
          cancel-text="No"
          @confirm="$emit('delete', event.id)"
          @click.stop
        >
          <a-button 
            size="small" 
            danger
            type="text"
            class="!bg-white/90 hover:!bg-white backdrop-blur-md !border-0 shadow-sm"
            @click.stop
          >
            <template #icon><DeleteOutlined /></template>
          </a-button>
        </a-popconfirm>
      </div>
    </div>

    <!-- Card Body -->
    <div class="p-5 flex-grow flex flex-col">
      <h3 class="text-xl font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-brand-600 transition-colors">
        {{ event.name }}
      </h3>
      
      <p class="text-slate-500 text-sm mb-4 line-clamp-2 flex-grow">
        {{ event.description || 'No description provided.' }}
      </p>
      
      <div class="space-y-2 mt-auto pt-4 border-t border-slate-100">
        <div class="flex items-center text-sm text-slate-600">
          <span class="font-medium">{{ formatDate(event.start_date) }}</span>
        </div>
        <div class="flex items-center text-sm text-slate-600" v-if="event.location">
          <span class="truncate">{{ event.location }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DeleteOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
});

defineEmits(['click', 'delete']);

const formatDate = (dateString) => {
  if (!dateString) return '';
  return dayjs(dateString).format('MMM D, YYYY h:mm A');
};
</script>
