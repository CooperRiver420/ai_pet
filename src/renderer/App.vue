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
  background: transparent;
  font-family: Arial, sans-serif;
  color: #fff;
  min-height: 100vh;
  overflow: hidden;
}

.app {
  width: 100vw;
  height: 100vh;
  position: relative;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
