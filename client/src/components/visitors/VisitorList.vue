<template>
  <div>
    <!-- Search Bar -->
    <div class="mb-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
      <a-input-search
        v-model:value="searchQuery"
        placeholder="Search visitors by name, email, or phone..."
        enter-button
        @search="handleSearch"
        size="large"
        class="w-full sm:max-w-md custom-search"
      />
    </div>

    <!-- Data Table -->
    <a-table
      :columns="columns"
      :data-source="visitors"
      :loading="isLoading"
      :row-key="record => record.id"
      :pagination="{ pageSize: 10, showSizeChanger: true }"
      class="custom-table"
      :scroll="{ x: 800 }"
    >
      <!-- Custom renderers -->
      <template #bodyCell="{ column, record }">
        <!-- Name & Email -->
        <template v-if="column.key === 'name'">
          <div class="flex items-center gap-3">
            <a-avatar 
              :style="{ backgroundColor: getAvatarColor(record.full_name) }"
              class="font-semibold"
            >
              {{ record.full_name.charAt(0).toUpperCase() }}
            </a-avatar>
            <div>
              <div class="font-semibold text-slate-800">{{ record.full_name }}</div>
              <div class="text-xs text-slate-500">{{ record.email || 'No email' }}</div>
            </div>
          </div>
        </template>

        <!-- Token -->
        <template v-else-if="column.key === 'token'">
          <div class="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded inline-block">
            {{ record.check_in_token }}
          </div>
        </template>

        <!-- Status -->
        <template v-else-if="column.key === 'status'">
          <VisitorStatusBadge :status="record.checked_in" />
        </template>

        <!-- Time -->
        <template v-else-if="column.key === 'time'">
          <span v-if="record.checked_in_at" class="text-slate-600 text-sm">
            {{ formatTime(record.checked_in_at) }}
          </span>
          <span v-else class="text-slate-400 text-sm">-</span>
        </template>

        <!-- Actions -->
        <template v-else-if="column.key === 'actions'">
          <div class="flex gap-2 justify-end">
            <a-button type="text" size="small" @click="$emit('edit', record)" class="text-brand-600 hover:text-brand-700 hover:bg-brand-50">
              Edit
            </a-button>
            <a-popconfirm
              title="Are you sure you want to delete this visitor?"
              @confirm="handleDelete(record.id)"
            >
              <a-button type="text" danger size="small" class="hover:bg-red-50">Delete</a-button>
            </a-popconfirm>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useVisitorStore } from '../../stores/useVisitorStore';
import VisitorStatusBadge from './VisitorStatusBadge.vue';
import dayjs from 'dayjs';

const props = defineProps({
  eventId: {
    type: [Number, String],
    required: true,
  },
});

defineEmits(['edit']);

const visitorStore = useVisitorStore();
const searchQuery = ref('');

const isLoading = computed(() => visitorStore.isLoading);
const visitors = computed(() => visitorStore.visitors);

const columns = [
  {
    title: 'Visitor',
    key: 'name',
    width: '25%',
  },
  {
    title: 'Company',
    dataIndex: 'company',
    key: 'company',
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: 'Token',
    key: 'token',
  },
  {
    title: 'Status',
    key: 'status',
  },
  {
    title: 'Check-in Time',
    key: 'time',
  },
  {
    title: 'Actions',
    key: 'actions',
    align: 'right',
  },
];

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    visitorStore.searchVisitors(props.eventId, searchQuery.value);
  } else {
    visitorStore.fetchVisitorsByEvent(props.eventId);
  }
};

const handleDelete = async (id) => {
  await visitorStore.deleteVisitor(id);
  handleSearch(); // Refresh list
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  return dayjs(dateString).format('MMM D, YYYY h:mm A');
};

const getAvatarColor = (name) => {
  if (!name) return '#3b82f6';
  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

onMounted(() => {
  visitorStore.fetchVisitorsByEvent(props.eventId);
});
</script>

<style>
.custom-table .ant-table {
  background: transparent;
}
.custom-table .ant-table-thead > tr > th {
  background: #f8fafc;
  color: #64748b;
  font-weight: 600;
  border-bottom: 1px solid #e2e8f0;
}
.custom-table .ant-table-tbody > tr > td {
  border-bottom: 1px solid #f1f5f9;
}
.custom-table .ant-table-tbody > tr:hover > td {
  background: #f8fafc;
}
</style>
