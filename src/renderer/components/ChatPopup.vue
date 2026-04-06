<template>
  <Transition name="slide-up">
    <div v-if="visible" class="chat-popup">
      <div class="chat-header">
        <span class="chat-title">🤖 AI 助手</span>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>
      
      <div class="chat-messages" ref="messagesRef">
        <div 
          v-for="(msg, index) in messages" 
          :key="index"
          :class="['message', msg.role]"
        >
          <span class="message-content">{{ msg.content }}</span>
        </div>
        <div v-if="loading" class="message assistant">
          <span class="message-content typing">思考中...</span>
        </div>
      </div>
      
      <div class="chat-input-area">
        <input 
          type="text" 
          v-model="inputText" 
          placeholder="输入消息..."
          @keydown.enter="sendMessage"
          :disabled="loading"
        />
        <VoiceInput 
          @result="onVoiceResult" 
          @error="onVoiceError"
        />
        <button @click="sendMessage" :disabled="loading || !inputText.trim()">
          发送
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import VoiceInput from './VoiceInput.vue'
import { chat, Message, getApiKey } from '@/services/minimax'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const messages = ref<Message[]>([
  {
    role: 'assistant',
    content: '你好！我是 AI Pet 助手，有什么可以帮助你的吗？'
  }
])

const inputText = ref('')
const loading = ref(false)
const messagesRef = ref<HTMLElement | null>(null)

// 自动滚动到底部
function scrollToBottom() {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    }
  })
}

watch(() => props.visible, (val) => {
  if (val) {
    scrollToBottom()
  }
})

watch(messages, () => {
  scrollToBottom()
}, { deep: true })

// 语音识别结果处理
function onVoiceResult(text: string) {
  inputText.value = text
}

// 语音识别错误处理
function onVoiceError(error: string) {
  messages.value.push({
    role: 'assistant',
    content: `语音识别错误: ${error}`
  })
}

async function sendMessage() {
  const text = inputText.value.trim()
  if (!text || loading.value) return
  
  // 检查 API Key
  if (!getApiKey()) {
    messages.value.push({
      role: 'assistant',
      content: '请先在设置中配置 MiniMax API Key'
    })
    return
  }
  
  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: text
  })
  inputText.value = ''
  loading.value = true
  
  try {
    const response = await chat(messages.value)
    messages.value.push({
      role: 'assistant',
      content: response
    })
  } catch (error: any) {
    messages.value.push({
      role: 'assistant',
      content: `错误: ${error.message}`
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.chat-popup {
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 320px;
  height: 400px;
  background: rgba(30, 30, 50, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 10001;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-title {
  color: #fff;
  font-size: 14px;
  font-weight: 500;
}

.close-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.close-btn:hover {
  color: #fff;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  max-width: 85%;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.4;
  word-break: break-word;
}

.message.user {
  align-self: flex-end;
  background: #00d9ff;
  color: #000;
  border-bottom-right-radius: 4px;
}

.message.assistant {
  align-self: flex-start;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-bottom-left-radius: 4px;
}

.typing {
  color: #888;
  font-style: italic;
}

.chat-input-area {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
}

.chat-input-area input {
  flex: 1;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  font-size: 13px;
}

.chat-input-area input:focus {
  outline: none;
  border-color: #00d9ff;
}

.chat-input-area input::placeholder {
  color: #666;
}

.chat-input-area button {
  padding: 10px 16px;
  background: #00d9ff;
  border: none;
  border-radius: 8px;
  color: #000;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

.chat-input-area button:disabled {
  background: #444;
  color: #888;
  cursor: not-allowed;
}

/* 动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
