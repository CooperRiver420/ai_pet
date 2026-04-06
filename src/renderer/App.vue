<script setup lang="ts">
import { ref, onMounted } from 'vue'

const electronInfo = ref('')

onMounted(() => {
  if (window.electronAPI) {
    electronInfo.value = `Platform: ${window.electronAPI.platform}, ` +
      `Electron: ${window.electronAPI.versions.electron}, ` +
      `Node: ${window.electronAPI.versions.node}, ` +
      `Chrome: ${window.electronAPI.versions.chrome}`
  }
})
</script>

<template>
  <div class="app">
    <h1>AI Pet</h1>
    <p v-if="electronInfo">{{ electronInfo }}</p>
    <p v-else>Loading...</p>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background: #1a1a2e;
  color: #fff;
  min-height: 100vh;
}

.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 20px;
}

h1 {
  font-size: 2.5rem;
  color: #00d9ff;
}

p {
  color: #aaa;
}
</style>
