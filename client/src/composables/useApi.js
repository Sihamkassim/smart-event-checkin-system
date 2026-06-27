import { ref } from 'vue';

export function useApi() {
  const isLoading = ref(false);
  const error = ref(null);

  const execute = async (apiCall) => {
    isLoading.value = true;
    error.value = null;
    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'An error occurred';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    error,
    execute,
    clearError: () => {
      error.value = null;
    },
  };
}
