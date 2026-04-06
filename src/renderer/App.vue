<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PetCanvas from './components/PetCanvas.vue'
import { PetState } from './utils/petState'

const electronInfo = ref('')
const petCanvasRef = ref()

onMounted(() => {
  if (window.electronAPI) {
    electronInfo.value = `Platform: ${window.electronAPI.platform}, ` +
      `Electron: ${window.electronAPI.versions.electron}, ` +
      `Node: ${window.electronAPI.versions.node}, ` +
      `Chrome: ${window.electronAPI.versions.chrome}`
  }
})

function onPetClick() {
  console.log('Pet clicked!')
}

// 测试用：点击不同区域切换状态
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
    <PetCanvas 
      ref="petCanvasRef"
      :scale="2"
      @click="onPetClick"
    />
    
    <!-- 测试用状态切换按钮 -->
    <div class="test-controls">
      <button @click="setHappy">Happy</button>
      <button @click="setBusy">Busy</button>
      <button @click="setHungry">Hungry</button>
      <button @click="setIdle">Idle</button>
    </div>
    
    <div class="info" v-if="electronInfo">
      {{ electronInfo }}
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
  min-height: 100vh;
  overflow: hidden !important;
}

body::-webkit-scrollbar {
  display: none !important;
}

.app {
  width: 100vw;
  height: 100vh;
  position: relative;
  background: transparent !important;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden !important;
}

.test-controls {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 1000;
  -webkit-app-region: no-drag;
}

.test-controls button {
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  font-size: 12px;
}

.test-controls button:hover {
  background: rgba(0, 0, 0, 0.8);
}

.info {
  position: fixed;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
}
</style>
