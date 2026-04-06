<template>
  <button 
    class="voice-btn"
    :class="{ recording: isRecording }"
    @click="toggleRecording"
    :title="isRecording ? '停止录音' : '开始语音输入'"
  >
    <span class="mic-icon">{{ isRecording ? '⏹️' : '🎤' }}</span>
  </button>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

// Web Speech API 类型声明
interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((this: ISpeechRecognition, event: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void) | null;
  onerror: ((this: ISpeechRecognition, event: { error: string }) => void) | null;
  onend: ((this: ISpeechRecognition, event: Event) => void) | null;
  start(): void;
  stop(): void;
}

interface ISpeechRecognitionConstructor {
  new (): ISpeechRecognition;
  prototype: ISpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: ISpeechRecognitionConstructor;
    webkitSpeechRecognition: ISpeechRecognitionConstructor;
  }
}

const emit = defineEmits<{
  result: [text: string]
  error: [message: string]
}>()

const isRecording = ref(false)
let recognition: ISpeechRecognition | null = null

function initRecognition() {
  // 检查浏览器支持
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SR) {
    emit('error', '当前浏览器不支持语音识别')
    return null
  }
  
  const rec = new SR()
  rec.continuous = false
  rec.interimResults = false
  rec.lang = 'zh-CN'
  
  rec.onresult = (event: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => {
    const text = event.results[0][0].transcript
    emit('result', text)
  }
  
  rec.onerror = (event: { error: string }) => {
    emit('error', event.error)
  }
  
  rec.onend = () => {
    isRecording.value = false
  }
  
  return rec
}

function toggleRecording() {
  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}

function startRecording() {
  if (!recognition) {
    recognition = initRecognition()
  }
  if (recognition) {
    try {
      recognition.start()
      isRecording.value = true
    } catch (e) {
      console.error('语音识别启动失败:', e)
    }
  }
}

function stopRecording() {
  if (recognition) {
    recognition.stop()
    isRecording.value = false
  }
}

onUnmounted(() => {
  if (recognition) {
    recognition.stop()
  }
})
</script>

<style scoped>
.voice-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.voice-btn:hover {
  background: rgba(0, 0, 0, 0.7);
  transform: scale(1.1);
}

.voice-btn.recording {
  background: #ff4444;
  animation: pulse 1s infinite;
}

.mic-icon {
  font-size: 18px;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
</style>
