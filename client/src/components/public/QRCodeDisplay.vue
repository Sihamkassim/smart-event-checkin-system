<template>
  <div class="qr-code-display">
    <a-card title="Your Check-in QR Code">
      <div class="qr-code">
        <QRCodeVue :value="token" :size="size" />
      </div>
      <p class="token-text">Token: <strong>{{ token }}</strong></p>
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

<style scoped>
.qr-code-display {
  max-width: 300px;
  margin: 0 auto;
}

.qr-code {
  display: flex;
  justify-content: center;
  margin: 16px 0;
}

.token-text {
  text-align: center;
  margin: 16px 0;
  color: #666;
}
</style>
