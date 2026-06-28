<template>
  <div class="h-[calc(100vh-8rem)] flex items-center justify-center -mt-8">
    <div class="w-full max-w-2xl">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-slate-800 tracking-tight mb-2">QR Scanner Mode</h1>
        <p class="text-slate-500">Scan visitor QR codes or enter tokens manually</p>
      </div>

      <!-- Main scanner card -->
      <div class="glass-card rounded-3xl p-2 bg-white/60">
        <div class="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-slate-100">
          <CheckInForm />
        </div>
      </div>
      
      <div class="text-center mt-6 text-slate-400 text-sm flex items-center justify-center gap-2">
        <SafetyCertificateOutlined /> Secure Check-in Terminal
      </div>
    </div>
  </div>
</template>

<script setup>
import { SafetyCertificateOutlined } from '@ant-design/icons-vue';
import CheckInForm from '../../components/checkin/CheckInForm.vue';
</script>
