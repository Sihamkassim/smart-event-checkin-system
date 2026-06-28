<template>
  <div class="min-h-screen relative overflow-hidden bg-navy-900 flex items-center justify-center p-4">
    <!-- Animated background -->
    <div class="absolute inset-0 z-0">
      <div class="absolute top-0 -left-4 w-72 h-72 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div class="absolute top-0 -right-4 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style="animation-delay: 2s;"></div>
      <div class="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style="animation-delay: 4s;"></div>
    </div>

    <!-- Content -->
    <div class="w-full max-w-md z-10 relative">
      <div class="text-center mb-8 animate-fade-in-up">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 mb-6 shadow-xl shadow-brand-500/30">
          <ScanOutlined class="text-white text-3xl" />
        </div>
        <h1 class="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
          {{ appName }}
        </h1>
        <p class="text-slate-400 text-lg">Smart Event Check-in System</p>
      </div>

      <div class="glass-card rounded-2xl p-8 animate-fade-in-up" style="animation-delay: 0.1s;">
        <router-view />
      </div>
      
      <p class="text-center text-slate-500 text-sm mt-8 animate-fade-in-up" style="animation-delay: 0.2s;">
        &copy; {{ new Date().getFullYear() }} {{ appName }}. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ScanOutlined } from '@ant-design/icons-vue';

const appName = import.meta.env.VITE_APP_NAME || 'Lahn Event';
</script>
