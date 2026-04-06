import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePanelStore = defineStore('panel', () => {
  const isPanelVisible = ref(false)
  
  function togglePanel() {
    isPanelVisible.value = !isPanelVisible.value
  }
  
  function showPanel() {
    isPanelVisible.value = true
  }
  
  function hidePanel() {
    isPanelVisible.value = false
  }
  
  return { isPanelVisible, togglePanel, showPanel, hidePanel }
})
