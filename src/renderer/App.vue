<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PetCanvas from './components/PetCanvas.vue'
import { PetState } from './utils/petState'

const electronInfo = ref('')
const petState = ref<PetState>(PetState.Idle)
const spriteSrc = ref('/src/renderer/assets/sprites/cat_idle.png')

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
</script>

<template>
  <div class="app">
    <PetCanvas 
      :sprite-src="spriteSrc"
      :state="petState"
      :scale="2"
      @click="onPetClick"
    />
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
  -webkit-app-region: drag; /* 整个窗口可拖拽 */
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
</style>
