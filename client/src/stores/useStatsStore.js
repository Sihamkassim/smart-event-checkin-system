import { defineStore } from 'pinia';
import { ref } from 'vue';
import { statsAPI } from '../api/stats';
import { message } from 'ant-design-vue';

export const useStatsStore = defineStore('stats', () => {
  const globalStats = ref(null);
  const isLoading = ref(false);
  const isAiLoading = ref(false);
  const aiAnswer = ref(null);

  const fetchGlobalStats = async () => {
    isLoading.value = true;
    try {
      const response = await statsAPI.getGlobalStats();
      if (response.success) {
        globalStats.value = response.stats;
      }
    } catch (err) {
      console.error('Failed to fetch global stats', err);
      message.error('Failed to load dashboard statistics');
    } finally {
      isLoading.value = false;
    }
  };

  const askAiAssistant = async (question) => {
    isAiLoading.value = true;
    aiAnswer.value = null;
    try {
      const response = await statsAPI.askAi(question);
      if (response.success) {
        aiAnswer.value = response.answer;
        return response;
      }
      return null;
    } catch (err) {
      console.error('Failed to ask AI', err);
      message.error('Failed to generate AI response');
      return null;
    } finally {
      isAiLoading.value = false;
    }
  };

  return {
    globalStats,
    isLoading,
    isAiLoading,
    aiAnswer,
    fetchGlobalStats,
    askAiAssistant,
  };
});
