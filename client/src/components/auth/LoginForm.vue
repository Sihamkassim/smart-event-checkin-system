<template>
  <a-form
    :model="formState"
    name="login"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
    class="space-y-4"
    layout="vertical"
  >
    <a-form-item
      name="email"
      :rules="[{ required: true, message: 'Please input your email!' }]"
      class="mb-4"
    >
      <a-input 
        v-model:value="formState.email" 
        placeholder="Email address"
        size="large"
        class="h-12 [&_.ant-input]:rounded-lg [&_.ant-input]:bg-slate-50 focus-within:bg-white [&_.ant-input-password]:rounded-lg [&_.ant-input-password]:bg-slate-50"
      >
        <template #prefix>
          <UserOutlined class="text-slate-400 mr-1" />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item
      name="password"
      :rules="[{ required: true, message: 'Please input your password!' }]"
      class="mb-6"
    >
      <a-input-password 
        v-model:value="formState.password" 
        placeholder="Password"
        size="large"
        class="h-12 [&_.ant-input]:rounded-lg [&_.ant-input]:bg-slate-50 focus-within:bg-white [&_.ant-input-password]:rounded-lg [&_.ant-input-password]:bg-slate-50"
      >
        <template #prefix>
          <LockOutlined class="text-slate-400 mr-1" />
        </template>
      </a-input-password>
    </a-form-item>

    <a-alert
      v-if="error"
      :message="error"
      type="error"
      show-icon
      class="mb-4 rounded-lg"
    />

    <a-form-item class="mb-0">
      <a-button
        type="primary"
        html-type="submit"
        class="w-full h-12 text-base font-semibold bg-brand-500 hover:bg-brand-600 rounded-xl shadow-lg shadow-brand-500/30 transition-all border-0"
        :loading="isLoading"
      >
        Sign In
      </a-button>
    </a-form-item>

    <!-- Demo Credentials (Review Only) -->
    <div class="mt-4 pt-4 border-t border-slate-200">
      <p class="text-xs text-slate-500 mb-2 text-center">Demo Credentials (Review Only)</p>
      <div class="flex gap-2">
        <a-button
          size="small"
          @click="fillDemoCreds('admin')"
          class="flex-1 text-xs"
        >
          Admin
        </a-button>
        <a-button
          size="small"
          @click="fillDemoCreds('staff')"
          class="flex-1 text-xs"
        >
          Staff
        </a-button>
      </div>
    </div>
  </a-form>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/useAuthStore';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';

const router = useRouter();
const authStore = useAuthStore();

const formState = reactive({
  email: '',
  password: '',
});

const isLoading = computed(() => authStore.isLoading);
const error = computed(() => authStore.error);

const onFinish = async (values) => {
  const result = await authStore.login(values.email, values.password);

  if (result.success) {
    router.push('/');
  }
};

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const fillDemoCreds = (type) => {
  if (type === 'admin') {
    formState.email = 'admin@lahn.test';
    formState.password = 'password123';
  } else if (type === 'staff') {
    formState.email = 'staff@lahn.test';
    formState.password = 'password123';
  }
};
</script>
