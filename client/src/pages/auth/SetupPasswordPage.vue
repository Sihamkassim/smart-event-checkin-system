<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-brand-50 to-indigo-50">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <div class="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/30 transform rotate-12">
          <LockOutlined class="text-white text-3xl -rotate-12" />
        </div>
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
        Activate Your Account
      </h2>
      <p class="mt-2 text-center text-sm text-slate-600">
        Please set a secure password to access your staff account.
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-100">
        <a-form :model="formState" @finish="onFinish" layout="vertical">
          <a-form-item
            name="password"
            label="New Password"
            :rules="[{ required: true, message: 'Please input your new password!' }, { min: 6, message: 'Password must be at least 6 characters.' }]"
          >
            <a-input-password
              v-model:value="formState.password"
              size="large"
              placeholder="••••••••"
              class="rounded-xl"
            >
              <template #prefix>
                <LockOutlined class="text-slate-400" />
              </template>
            </a-input-password>
          </a-form-item>
          
          <a-form-item
            name="confirmPassword"
            label="Confirm Password"
            :rules="[
              { required: true, message: 'Please confirm your password!' },
              { validator: validateConfirmPassword }
            ]"
          >
            <a-input-password
              v-model:value="formState.confirmPassword"
              size="large"
              placeholder="••••••••"
              class="rounded-xl"
            >
              <template #prefix>
                <LockOutlined class="text-slate-400" />
              </template>
            </a-input-password>
          </a-form-item>

          <a-form-item class="mt-6 mb-0">
            <a-button
              type="primary"
              html-type="submit"
              size="large"
              block
              :loading="isLoading"
              class="bg-brand-500 hover:bg-brand-600 h-12 text-base font-semibold rounded-xl shadow-md shadow-brand-500/20"
            >
              Set Password & Activate
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { LockOutlined } from '@ant-design/icons-vue';
import { authAPI } from '../../api/auth';
import { message } from 'ant-design-vue';

const router = useRouter();
const route = useRoute();
const isLoading = ref(false);
const token = ref('');

const formState = reactive({
  password: '',
  confirmPassword: '',
});

onMounted(() => {
  if (route.query.token) {
    token.value = route.query.token;
  } else {
    message.error('Invalid or missing activation token.');
    router.push('/login');
  }
});

const validateConfirmPassword = async (_rule, value) => {
  if (value === '') {
    return Promise.reject('Please confirm your password');
  } else if (value !== formState.password) {
    return Promise.reject("Passwords don't match!");
  } else {
    return Promise.resolve();
  }
};

const onFinish = async (values) => {
  if (!token.value) {
    message.error('Activation token is missing!');
    return;
  }

  isLoading.value = true;
  try {
    const response = await authAPI.setupPassword(token.value, values.password);
    if (response.success) {
      message.success(response.message || 'Account activated successfully!');
      router.push('/login');
    } else {
      message.error(response.message || 'Failed to activate account.');
    }
  } catch (error) {
    message.error(error.response?.data?.message || 'An error occurred during activation.');
  } finally {
    isLoading.value = false;
  }
};
</script>
