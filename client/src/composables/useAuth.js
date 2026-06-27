import { computed } from 'vue';
import { useAuthStore } from '../stores/useAuthStore';

export function useAuth() {
  const authStore = useAuthStore();

  return {
    user: computed(() => authStore.user),
    token: computed(() => authStore.token),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isLoading: computed(() => authStore.isLoading),
    login: authStore.login,
    logout: authStore.logout,
    checkAuth: authStore.checkAuth,
  };
}
