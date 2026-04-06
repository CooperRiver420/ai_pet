<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import PetCanvas from './components/PetCanvas.vue'
import { PetState } from './utils/petState'

const electronInfo = ref('')
const petCanvasRef = ref()
const appRef = ref()

// 拖拽状态
let isDragging = false
let dragOffsetX = 0
let dragOffsetY = 0

onMounted(() => {
  if (window.electronAPI) {
    electronInfo.value = `Platform: ${window.electronAPI.platform}, ` +
      `Electron: ${window.electronAPI.versions.electron}, ` +
      `Node: ${window.electronAPI.versions.node}, ` +
      `Chrome: ${window.electronAPI.versions.chrome}`
  }
})

function onMouseDown(e: MouseEvent) {
  if (e.button !== 0) return // 只响应左键
  isDragging = true
  dragOffsetX = e.screenX
  dragOffsetY = e.screenY
  window.electronAPI?.getPetPosition().then(pos => {
    dragOffsetX = e.screenX - pos.x
    dragOffsetY = e.screenY - pos.y
  })
}

function onMouseMove(e: MouseEvent) {
  if (!isDragging) return
  const x = e.screenX - dragOffsetX
  const y = e.screenY - dragOffsetY
  window.electronAPI?.setPetPosition(x, y)
}

function onMouseUp() {
  isDragging = false
}

function onPetClick() {
  console.log('Pet clicked!')
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
  <div 
    ref="appRef"
    class="app" 
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @mouseleave="onMouseUp"
  >
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
  width: 64px;
  height: 64px;
  position: fixed;
  background: transparent !important;
  overflow: hidden !important;
  cursor: move; /* 拖拽时显示移动光标 */
}
</style>
