<template>
  <a-card title="Event Registration">
    <a-form
      :model="formState"
      layout="vertical"
      @finish="handleSubmit"
      :rules="rules"
    >
      <a-form-item label="Full Name" name="full_name">
        <a-input v-model:value="formState.full_name" placeholder="Enter your full name" size="large" />
      </a-form-item>

      <a-form-item label="Phone" name="phone">
        <a-input v-model:value="formState.phone" placeholder="Enter your phone number" size="large" />
      </a-form-item>

      <a-form-item label="Email" name="email">
        <a-input v-model:value="formState.email" placeholder="Enter your email" size="large" />
      </a-form-item>

      <a-form-item label="Company" name="company">
        <a-input v-model:value="formState.company" placeholder="Enter your company (optional)" size="large" />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" size="large" block :loading="isLoading">
          Register
        </a-button>
      </a-form-item>
    </a-form>

    <a-alert
      v-if="result"
      :message="result.success ? 'Registration Successful!' : 'Registration Failed'"
      :description="result.message"
      :type="result.success ? 'success' : 'error'"
      show-icon
      closable
      @close="result = null"
      style="margin-top: 16px"
    />

    <a-card v-if="result?.success && result.visitor" title="Your QR Code" style="margin-top: 16px">
      <div class="flex justify-center my-4">
        <QRCodeVue :value="result.visitor.check_in_token" :size="200" />
      </div>
      <p class="text-center mt-4 text-slate-500">Your check-in token: <strong>{{ result.visitor.check_in_token }}</strong></p>
    </a-card>
  </a-card>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { publicAPI } from '../../api/public';
import QRCodeVue from 'qrcode.vue';

const props = defineProps({
  eventId: {
    type: Number,
    required: true,
  },
});

const formState = reactive({
  full_name: '',
  phone: '',
  email: '',
  company: '',
});

const isLoading = ref(false);
const result = ref(null);

const rules = {
  full_name: [{ required: true, message: 'Please enter your full name' }],
  phone: [{ required: true, message: 'Please enter your phone number' }],
  email: [
    { required: true, message: 'Please enter your email' },
    { type: 'email', message: 'Please enter a valid email' },
  ],
};

const handleSubmit = async () => {
  isLoading.value = true;
  result.value = null;

  try {
    const response = await publicAPI.register({
      ...formState,
      event_id: props.eventId,
    });
    result.value = {
      success: response.success,
      message: response.message,
      visitor: response.visitor,
    };
  } catch (error) {
    result.value = {
      success: false,
      message: 'Registration failed',
    };
  } finally {
    isLoading.value = false;
  }
};
</script>
