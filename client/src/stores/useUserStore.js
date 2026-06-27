import { defineStore } from 'pinia';
import { ref } from 'vue';
import { usersAPI } from '../api/users';

export const useUserStore = defineStore('user', () => {
  const users = ref([]);
  const isLoading = ref(false);

  const fetchUsers = async () => {
    isLoading.value = true;
    try {
      const response = await usersAPI.getAll();
      if (response.success) {
        users.value = response.users;
      }
    } finally {
      isLoading.value = false;
    }
  };

  const createStaff = async (staffData) => {
    isLoading.value = true;
    try {
      const response = await usersAPI.createStaff(staffData);
      if (response.success) {
        users.value.unshift(response.user);
      }
      return response;
    } catch (err) {
      return { success: false };
    } finally {
      isLoading.value = false;
    }
  };

  const updateStaff = async (id, staffData) => {
    isLoading.value = true;
    try {
      const response = await usersAPI.updateStaff(id, staffData);
      if (response.success) {
        const index = users.value.findIndex(u => u.id === id);
        if (index !== -1) {
          users.value[index] = response.user;
        }
      }
      return response;
    } catch (err) {
      return { success: false };
    } finally {
      isLoading.value = false;
    }
  };

  const sendActivationEmail = async (id) => {
    isLoading.value = true;
    try {
      const response = await usersAPI.sendActivationEmail(id);
      return response;
    } catch (err) {
      return { success: false };
    } finally {
      isLoading.value = false;
    }
  };

  return {
    users,
    isLoading,
    fetchUsers,
    createStaff,
    updateStaff,
    sendActivationEmail,
  };
});
