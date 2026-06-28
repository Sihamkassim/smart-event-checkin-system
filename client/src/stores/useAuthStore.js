import { defineStore } from 'pinia';
import { ref } from 'vue';
import { authAPI } from '../api/auth';
import { TOKEN_KEY, USER_KEY } from '../api/client';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(null);
  const isAuthenticated = ref(false);
  const isLoading = ref(false);

  const login = async (email, password) => {
    isLoading.value = true;
    try {
      const response = await authAPI.login(email, password);
      token.value = response.token;
      user.value = response.user;
      isAuthenticated.value = true;
      
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      
      return { success: true };
    } catch (err) {
      return { success: false };
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    user.value = null;
    token.value = null;
    isAuthenticated.value = false;
  };

  const checkAuth = () => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    
    if (storedToken && userStr) {
      try {
        token.value = storedToken;
        user.value = JSON.parse(userStr);
        isAuthenticated.value = true;
      } catch (err) {
        logout();
      }
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
  };
});
