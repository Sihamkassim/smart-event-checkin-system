<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 tracking-tight m-0">Staff Management</h1>
        <p class="text-slate-500 mt-1">Manage staff accounts and their permissions.</p>
      </div>
      
      <a-button type="primary" size="large" @click="showCreateModal = true" class="bg-brand-500 hover:bg-brand-600 rounded-lg">
        <template #icon><UserAddOutlined /></template>
        Add Staff
      </a-button>
    </div>

    <!-- Staff Table -->
    <div class="glass-card rounded-2xl overflow-hidden shadow-sm">
      <a-table 
        :dataSource="users" 
        :columns="columns" 
        :loading="isLoading"
        rowKey="id"
        :pagination="{ pageSize: 10 }"
        :scroll="{ x: 'max-content' }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'role'">
            <a-tag :color="record.role === 'admin' ? 'purple' : 'blue'">
              {{ record.role.toUpperCase() }}
            </a-tag>
          </template>
          
          <template v-else-if="column.key === 'status'">
            <a-badge v-if="record.status === 'active'" status="success" text="Active" />
            <a-badge v-else status="warning" text="Pending" />
          </template>
          
          <template v-else-if="column.key === 'permissions'">
            <div class="flex flex-wrap gap-1">
              <a-tag v-for="perm in record.permissions" :key="perm" class="text-xs">
                {{ perm }}
              </a-tag>
              <span v-if="!record.permissions?.length" class="text-slate-400 text-sm">None</span>
            </div>
          </template>

          <template v-else-if="column.key === 'action'">
            <div class="flex items-center gap-3">
              <a-tooltip title="Copy Activation Link" v-if="record.status === 'pending' && record.activation_token">
                <a-button 
                  type="text" 
                  class="text-brand-500 hover:text-brand-600 p-1 flex items-center justify-center"
                  @click="copyActivationLink(record.activation_token)"
                >
                  <CopyOutlined />
                </a-button>
              </a-tooltip>
              
              <a-tooltip title="Send Activation Email" v-if="record.status === 'pending' && record.activation_token">
                <a-button 
                  type="text" 
                  class="text-emerald-500 hover:text-emerald-600 p-1 flex items-center justify-center"
                  @click="handleSendEmail(record.id)"
                >
                  <MailOutlined />
                </a-button>
              </a-tooltip>
              
              <a-tooltip title="Edit Permissions">
                <a-button 
                  type="text" 
                  class="text-slate-500 hover:text-slate-800 p-1 flex items-center justify-center"
                  @click="openEditModal(record)"
                >
                  <EditOutlined />
                </a-button>
              </a-tooltip>
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <!-- Create Staff Modal -->
    <a-modal v-model:open="showCreateModal" title="Add New Staff" @ok="handleCreateStaff" :confirmLoading="isCreating">
      <a-form :model="formState" layout="vertical" class="mt-4">
        <a-form-item label="Full Name" name="name" :rules="[{ required: true, message: 'Please input the name!' }]">
          <a-input v-model:value="formState.name" placeholder="John Doe" size="large" class="rounded-xl" />
        </a-form-item>
        
        <a-form-item label="Email Address" name="email" :rules="[{ required: true, type: 'email' }]">
          <a-input v-model:value="formState.email" placeholder="john@example.com" size="large" class="rounded-xl" />
        </a-form-item>
        
        <a-form-item label="Permissions">
          <a-checkbox-group v-model:value="formState.permissions" class="flex flex-col gap-2">
            <a-checkbox value="checkin">Scanner / Check-in Mode</a-checkbox>
            <a-checkbox value="manage_visitors">Manage Visitors (Add/Import)</a-checkbox>
            <a-checkbox value="use_ai">Use AI Assistant</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
      </a-form>
      
      <div v-if="activationLink" class="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
        <p class="text-sm text-emerald-800 font-medium mb-2">Staff created successfully! Send them this activation link:</p>
        <div class="flex items-center gap-2 bg-white p-2 rounded border border-emerald-200">
          <input :value="activationLink" readonly class="flex-1 text-xs outline-none bg-transparent" />
          <a-button size="small" @click="copyToClipboard(activationLink)">Copy</a-button>
        </div>
      </div>
    </a-modal>

    <!-- Edit Staff Modal -->
    <a-modal v-model:open="showEditModal" title="Edit Staff Permissions" @ok="handleEditStaff" :confirmLoading="isEditing">
      <a-form :model="editFormState" layout="vertical" class="mt-4">
        <a-form-item label="Full Name" name="name" :rules="[{ required: true, message: 'Please input the name!' }]">
          <a-input v-model:value="editFormState.name" placeholder="John Doe" size="large" class="rounded-xl" />
        </a-form-item>
        
        <a-form-item label="Permissions">
          <a-checkbox-group v-model:value="editFormState.permissions" class="flex flex-col gap-2">
            <a-checkbox value="checkin">Scanner / Check-in Mode</a-checkbox>
            <a-checkbox value="manage_visitors">Manage Visitors (Add/Import)</a-checkbox>
            <a-checkbox value="use_ai">Use AI Assistant</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { UserAddOutlined, CopyOutlined, MailOutlined, EditOutlined } from '@ant-design/icons-vue';
import { useUserStore } from '../../stores/useUserStore';
import { message } from 'ant-design-vue';

const userStore = useUserStore();
const users = computed(() => userStore.users);
const isLoading = computed(() => userStore.isLoading);

const showCreateModal = ref(false);
const showEditModal = ref(false);
const isCreating = ref(false);
const isEditing = ref(false);
const activationLink = ref('');
const editingUserId = ref(null);

const formState = reactive({
  name: '',
  email: '',
  permissions: []
});

const editFormState = reactive({
  name: '',
  permissions: []
});

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Role', dataIndex: 'role', key: 'role' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  { title: 'Permissions', dataIndex: 'permissions', key: 'permissions' },
  { title: 'Action', key: 'action' }
];

onMounted(() => {
  userStore.fetchUsers();
});

const handleCreateStaff = async () => {
  if (!formState.name || !formState.email) {
    message.error('Name and email are required');
    return;
  }
  
  isCreating.value = true;
  activationLink.value = '';
  
  const response = await userStore.createStaff({ ...formState });
  
  isCreating.value = false;
  
  if (response.success) {
    activationLink.value = response.activationLink;
    formState.name = '';
    formState.email = '';
    formState.permissions = [];
  } else {
    message.error(response.message || 'Failed to create staff');
  }
};

const openEditModal = (user) => {
  if (user.role === 'admin') {
    message.warning('Cannot edit admin accounts.');
    return;
  }
  editingUserId.value = user.id;
  editFormState.name = user.name;
  editFormState.permissions = [...(user.permissions || [])];
  showEditModal.value = true;
};

const handleEditStaff = async () => {
  if (!editFormState.name) {
    message.error('Name is required');
    return;
  }

  isEditing.value = true;
  
  const response = await userStore.updateStaff(editingUserId.value, { ...editFormState });
  
  isEditing.value = false;
  
  if (response.success) {
    showEditModal.value = false;
    editingUserId.value = null;
  } else {
    message.error(response.message || 'Failed to update staff');
  }
};

const handleSendEmail = async (userId) => {
  await userStore.sendActivationEmail(userId);
};

const copyActivationLink = (token) => {
  const link = `${window.location.origin}/setup-password?token=${token}`;
  copyToClipboard(link);
};

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    message.success('Activation link copied to clipboard!');
  });
};
</script>
