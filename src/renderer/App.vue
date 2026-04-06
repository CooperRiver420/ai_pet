<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PetCanvas from './components/PetCanvas.vue'
import QuickPanel from './components/QuickPanel.vue'
import { usePanelStore } from './stores/panelStore'
import { PetState } from './utils/petState'

const electronInfo = ref('')
const petCanvasRef = ref()
const panelStore = usePanelStore()

onMounted(async () => {
  if (window.electronAPI) {
    electronInfo.value = `Platform: ${window.electronAPI.platform}, ` +
      `Electron: ${window.electronAPI.versions.electron}, ` +
      `Node: ${window.electronAPI.versions.node}, ` +
      `Chrome: ${window.electronAPI.versions.chrome}`
  }
})

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

function onSettings() {
  console.log('Settings triggered')
  panelStore.hidePanel()
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
      @settings="onSettings"
    />
    
    <!-- 测试用状态切换按钮（不可拖拽区域） -->
    <div class="test-controls">
      <button @click.stop="setHappy">H</button>
      <button @click.stop="setBusy">B</button>
      <button @click.stop="setHungry">Hu</button>
      <button @click.stop="setIdle">I</button>
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
