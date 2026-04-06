<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import PetCanvas from './components/PetCanvas.vue'
import QuickPanel from './components/QuickPanel.vue'
import SettingsModal from './components/SettingsModal.vue'
import ChatPopup from './components/ChatPopup.vue'
import BlindBoxPopup from './components/BlindBoxPopup.vue'
import { usePanelStore } from './stores/panelStore'
import { PetState } from './utils/petState'

const electronInfo = ref('')
const petCanvasRef = ref()
const panelStore = usePanelStore()
const showSettings = ref(false)
const showChat = ref(false)
const showBlindBox = ref(false)

onMounted(async () => {
  if (window.electronAPI) {
    electronInfo.value = `Platform: ${window.electronAPI.platform}, ` +
      `Electron: ${window.electronAPI.versions.electron}, ` +
      `Node: ${window.electronAPI.versions.node}, ` +
      `Chrome: ${window.electronAPI.versions.chrome}`
  }

  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeyDown)
})

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    panelStore.hidePanel()
  }
}

function handleClickOutside(e: MouseEvent) {
  const panel = document.querySelector('.quick-panel')
  const pet = document.querySelector('.pet-area')
  if (panel && !panel.contains(e.target as Node) && !pet?.contains(e.target as Node)) {
    panelStore.hidePanel()
  }
}

function onPetClick() {
  console.log('Pet clicked!')
  panelStore.togglePanel()
}

function onPanelClose() {
  panelStore.hidePanel()
}

function onDrinkWater() {
  console.log('Drink water triggered')
  panelStore.hidePanel()
}

function onPomodoro() {
  console.log('Pomodoro triggered')
  panelStore.hidePanel()
}

function onQuickCopy() {
  console.log('Quick copy triggered')
  panelStore.hidePanel()
}

function onAIChat() {
  console.log('AI Chat triggered')
  panelStore.hidePanel()
  showChat.value = true
}

function onSettings() {
  console.log('Settings triggered')
  panelStore.hidePanel()
  showSettings.value = true
}

function onChatClose() {
  showChat.value = false
}

function onBlindBox() {
  console.log('Blind box triggered')
  panelStore.hidePanel()
  showBlindBox.value = true
}

function onBlindBoxClose() {
  showBlindBox.value = false
}

function setHappy() {
  petCanvasRef.value?.setState(PetState.Happy)
}
function setBusy() {
  petCanvasRef.value?.setState(PetState.Busy)
}
function setHungry() {
  petCanvasRef.value?.setState(PetState.Hungry)
}
function setIdle() {
  petCanvasRef.value?.setState(PetState.Idle)
}
</script>

<template>
  <div class="app">
    <!-- 宠物区域可拖拽 -->
    <div class="pet-area">
      <PetCanvas 
        ref="petCanvasRef"
        :scale="2"
        @click="onPetClick"
      />
    </div>
    
    <!-- 快捷面板 -->
    <QuickPanel
      :visible="panelStore.isPanelVisible"
      @close="onPanelClose"
      @drinkWater="onDrinkWater"
      @pomodoro="onPomodoro"
      @quickCopy="onQuickCopy"
      @aiChat="onAIChat"
      @settings="onSettings"
      @blindBox="onBlindBox"
    />

    <!-- AI 聊天弹窗 -->
    <ChatPopup
      :visible="showChat"
      @close="onChatClose"
    />

    <!-- 设置弹窗 -->
    <SettingsModal
      :visible="showSettings"
      @close="showSettings = false"
    />

    <!-- 盲盒弹窗 -->
    <BlindBoxPopup
      :visible="showBlindBox"
      @close="onBlindBoxClose"
    />
    
    <!-- 测试用状态切换按钮（不可拖拽区域） -->
    <div class="test-controls">
      <button @click.stop="setHappy">H</button>
      <button @click.stop="setBusy">B</button>
      <button @click.stop="setHungry">Hu</button>
      <button @click.stop="setIdle">I</button>
      <button @click.stop="showBlindBox = true" title="盲盒">🎁</button>
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  background: transparent !important;
  font-family: Arial, sans-serif;
  color: #fff;
  height: 100vh;
  overflow: hidden !important;
}

body::-webkit-scrollbar {
  display: none !important;
}

.app {
  width: 100%;
  height: 100%;
  position: relative;
  background: transparent !important;
}

/* 宠物区域 - 可拖拽 */
.pet-area {
  width: 64px;
  height: 64px;
  position: absolute;
  top: 0;
  left: 0;
  -webkit-app-region: drag; /* 启用拖拽 */
  cursor: move;
}

/* 测试按钮 - 不可拖拽 */
.test-controls {
  position: fixed;
  bottom: 10px;
  right: 10px;
  display: flex;
  gap: 4px;
  z-index: 9999;
  -webkit-app-region: no-drag; /* 禁用拖拽，允许点击 */
}

.test-controls button {
  width: 28px;
  height: 28px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  font-size: 11px;
  padding: 0;
}

.test-controls button:hover {
  background: rgba(0, 0, 0, 0.9);
}
</style>
