<template>
  <div class="max-w-[300px] mx-auto">
    <a-card title="Your Check-in QR Code">
      <div class="flex justify-center my-4">
        <QRCodeVue :value="token" :size="size" />
      </div>
      <p class="text-center my-4 text-slate-500">Token: <strong>{{ token }}</strong></p>
      <a-button type="primary" block @click="handleDownload">
        Download QR Code
      </a-button>
    </a-card>
  </div>
</template>

<script setup>
import { QRCodeVue } from 'qrcode.vue';

const props = defineProps({
  token: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    default: 200,
  },
});

const handleDownload = () => {
  // QR code download functionality would go here
  console.log('Download QR code for token:', props.token);
};
</script>
