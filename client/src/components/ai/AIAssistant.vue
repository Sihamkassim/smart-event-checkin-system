<template>
  <a-card title="AI Assistant" class="h-[500px] flex flex-col [&_.ant-card-body]:flex-1 [&_.ant-card-body]:flex [&_.ant-card-body]:flex-col [&_.ant-card-body]:overflow-hidden">
    <div class="flex flex-col h-full overflow-hidden">
      <div class="flex-1 overflow-y-auto p-4 bg-slate-100 rounded-lg mb-4 space-y-3" ref="messagesContainer">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['flex', message.role === 'user' ? 'justify-end' : 'justify-start']"
        >
          <div :class="['max-w-[70%] px-3 py-2 rounded-xl break-words', message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-slate-800 border border-slate-200']">
            {{ message.content }}
          </div>
        </div>
        <div v-if="isLoading" class="flex justify-start">
          <div class="max-w-[70%] px-3 py-2 rounded-xl break-words bg-white text-slate-800 border border-slate-200">
            <a-spin size="small" /> Thinking...
          </div>
        </div>
      </div>
      <div class="flex gap-2 shrink-0">
        <a-input
          v-model:value="inputMessage"
          placeholder="Ask me anything about events, visitors, or check-ins..."
          @pressEnter="handleSend"
          :disabled="isLoading"
        >
          <template #suffix>
            <a-button
              type="primary"
              size="small"
              @click="handleSend"
              :loading="isLoading"
            >
              Send
            </a-button>
          </template>
        </a-input>
      </div>
    </div>
  </a-card>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { useToast } from '../../composables/useToast';

const inputMessage = ref('');
const messages = ref([
  {
    role: 'assistant',
    content: 'Hello! I\'m your AI assistant. How can I help you with event management today?',
  },
]);
const isLoading = ref(false);
const messagesContainer = ref(null);

const { success, error } = useToast();

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const handleSend = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return;

  const userMessage = inputMessage.value.trim();
  messages.value.push({
    role: 'user',
    content: userMessage,
  });
  inputMessage.value = '';

  await scrollToBottom();

  isLoading.value = true;

  try {
    // Simulate AI response (replace with actual AI API call)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const aiResponse = generateAIResponse(userMessage);
    
    messages.value.push({
      role: 'assistant',
      content: aiResponse,
    });
    
    success('Response received');
  } catch (err) {
    error('Failed to get AI response');
    messages.value.push({
      role: 'assistant',
      content: 'Sorry, I encountered an error. Please try again.',
    });
  } finally {
    isLoading.value = false;
    await scrollToBottom();
  }
};

const generateAIResponse = (question) => {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('event') || lowerQuestion.includes('events')) {
    return 'You can manage events from the Events page. You can create new events, view event details, and check event statistics. Would you like me to help you navigate there?';
  }
  
  if (lowerQuestion.includes('visitor') || lowerQuestion.includes('check-in')) {
    return 'Visitors can be checked in using their unique check-in tokens. You can scan QR codes or enter tokens manually on the Check-in page. Would you like to check someone in?';
  }
  
  if (lowerQuestion.includes('help') || lowerQuestion.includes('what can you do')) {
    return 'I can help you with:\n- Navigating to different pages\n- Understanding how to use the check-in system\n- Managing events and visitors\n- Answering questions about the system\n\nWhat would you like to know?';
  }
  
  return 'I understand you\'re asking about: "' + question + '". While I\'m a demo assistant, I can help you navigate the system or answer general questions about event management. How else can I assist you?';
};
</script>

</script>
