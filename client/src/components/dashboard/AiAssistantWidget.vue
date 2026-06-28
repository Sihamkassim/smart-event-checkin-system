<template>
  <div>
    <!-- Floating Action Button -->
    <div 
      class="fixed bottom-8 right-8 z-50 w-14 h-14 bg-brand-500 rounded-full shadow-lg shadow-brand-500/40 flex items-center justify-center cursor-pointer hover:bg-brand-600 transition-transform hover:scale-105"
      @click="toggleChat"
    >
      <MessageOutlined class="text-white text-2xl" />
    </div>

    <!-- Chat Window -->
    <div 
      v-if="isOpen"
      class="fixed bottom-24 right-8 z-50 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
      style="height: 500px; max-height: calc(100vh - 120px);"
    >
      <!-- Header -->
      <div class="bg-brand-500 p-4 text-white flex justify-between items-center">
        <div class="flex items-center gap-2">
          <RobotOutlined class="text-xl" />
          <h3 class="font-semibold text-lg m-0 text-white">System AI Assistant</h3>
        </div>
        <CloseOutlined class="cursor-pointer hover:text-slate-200" @click="toggleChat" />
      </div>

      <!-- Chat History -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50" ref="chatContainer">
        <div v-for="(msg, index) in messages" :key="index" class="flex" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
          <div 
            class="max-w-[85%] rounded-2xl p-3 text-sm [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-2 [&_li]:mb-1"
            :class="msg.role === 'user' ? 'bg-brand-500 text-white rounded-br-none' : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'"
            v-html="msg.role === 'user' ? msg.content : renderMarkdown(msg.content)"
          >
          </div>
        </div>
        
        <!-- Loading Indicator -->
        <div v-if="isAiLoading" class="flex justify-start">
          <div class="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-3 flex gap-1 items-center">
            <span class="w-2 h-2 bg-brand-300 rounded-full animate-bounce"></span>
            <span class="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></span>
            <span class="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="p-3 bg-white border-t border-slate-100">
        <!-- Quick Questions -->
        <div class="grid grid-cols-2 gap-2 mb-3">
          <button
            v-for="quickQuestion in quickQuestions"
            :key="quickQuestion"
            @click="handleQuickQuestion(quickQuestion)"
            :disabled="isAiLoading"
            class="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors disabled:opacity-50"
          >
            {{ quickQuestion }}
          </button>
        </div>
        <form @submit.prevent="sendMessage" class="flex gap-2">
          <input
            v-model="inputQuery"
            type="text"
            placeholder="Ask about attendance..."
            class="flex-1 px-4 py-2 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-sm"
            :disabled="isAiLoading"
          />
          <button
            type="submit"
            :disabled="!inputQuery.trim() || isAiLoading"
            class="w-10 h-10 bg-brand-500 rounded-xl text-white flex items-center justify-center hover:bg-brand-600 disabled:opacity-50 transition-colors"
          >
            <SendOutlined />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, computed } from 'vue';
import { MessageOutlined, RobotOutlined, CloseOutlined, SendOutlined } from '@ant-design/icons-vue';
import { useStatsStore } from '../../stores/useStatsStore';
import { marked } from 'marked';

const props = defineProps({
  eventId: {
    type: [Number, String],
    default: null
  }
});

const statsStore = useStatsStore();
const isOpen = ref(false);
const inputQuery = ref('');
const chatContainer = ref(null);

const isAiLoading = computed(() => statsStore.isAiLoading);

const messages = ref([
  { role: 'ai', content: props.eventId ? 'Hello! I am your Event AI assistant. You can ask me questions about this specific event\'s statistics.' : 'Hello! I am your AI assistant. You can ask me questions about historical system stats and event attendance.' }
]);

const quickQuestions = computed(() => {
  if (props.eventId) {
    return [
      'What\'s the total attendance for this event?',
      'Show me recent check-ins for this event',
      'Tell me about this event?',
    ];
  } else {
    return [
      'What\'s the total attendance?',
      'Show me recent check-ins',
      'How many events are active?',
    ];
  }
});

const renderMarkdown = (text) => {
  return marked(text || '');
};

const toggleChat = () => {
  isOpen.value = !isOpen.value;
};

const handleQuickQuestion = (question) => {
  inputQuery.value = question;
  sendMessage();
};

const sendMessage = async () => {
  const query = inputQuery.value.trim();
  if (!query || isAiLoading.value) return;

  // Add user message
  messages.value.push({ role: 'user', content: query });
  inputQuery.value = '';
  scrollToBottom();

  // Call API
  const response = await statsStore.askAiAssistant(query, props.eventId);
  
  if (response && response.answer) {
    messages.value.push({ role: 'ai', content: response.answer });
  } else {
    messages.value.push({ role: 'ai', content: 'Sorry, I encountered an error answering your question.' });
  }
  
  scrollToBottom();
};

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};
</script>
