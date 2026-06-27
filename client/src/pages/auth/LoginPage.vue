<template>
  <div class="w-full">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-slate-800 mb-2">Welcome Back</h2>
      <p class="text-slate-500">Sign in to manage your events and check-ins</p>
    </div>
    
    <LoginForm />
  </div>
</template>

<script setup>
import LoginForm from '../../components/auth/LoginForm.vue';
</script>
