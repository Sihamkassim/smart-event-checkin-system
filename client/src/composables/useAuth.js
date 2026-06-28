import { computed } from 'vue';
import { useAuthStore } from '../stores/useAuthStore';

export function useAuth() {
  const authStore = useAuthStore();

  const user = computed(() => authStore.user);

  const hasPermission = (permission) => {
    if (!user.value) return false;
    if (user.value.role === 'admin') return true;
    return user.value.permissions?.includes(permission) || false;
  };

  const canManageVisitors = computed(() => hasPermission('manage_visitors'));
  const canUseAI = computed(() => hasPermission('use_ai'));
  const canCheckin = computed(() => hasPermission('checkin'));

  return {
    user: computed(() => authStore.user),
    token: computed(() => authStore.token),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isLoading: computed(() => authStore.isLoading),
    login: authStore.login,
    logout: authStore.logout,
    checkAuth: authStore.checkAuth,
    hasPermission,
    canManageVisitors,
    canUseAI,
    canCheckin,
  };
}
