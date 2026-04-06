<template>
  <Transition name="slide">
    <div v-if="visible" class="quick-panel">
      <div class="panel-header">
        <span>工具箱</span>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>
      <div class="panel-content">
        <button class="tool-btn" @click="onDrinkWater">
          <span class="icon">💧</span>
          <span class="label">喝水</span>
        </button>
        <button class="tool-btn" @click="onPomodoro">
          <span class="icon">🍅</span>
          <span class="label">番茄钟</span>
        </button>
        <button class="tool-btn" @click="onQuickCopy">
          <span class="icon">📋</span>
          <span class="label">复制</span>
        </button>
        <button class="tool-btn" @click="onSettings">
          <span class="icon">⚙️</span>
          <span class="label">设置</span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
  drinkWater: []
  pomodoro: []
  quickCopy: []
  settings: []
}>()

function onDrinkWater() { emit('drinkWater') }
function onPomodoro() { emit('pomodoro') }
function onQuickCopy() { emit('quickCopy') }
function onSettings() { emit('settings') }
</script>

<style scoped>
.quick-panel {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 160px;
  background: rgba(30, 30, 50, 0.95);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  z-index: 10000;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  font-size: 13px;
  font-weight: 500;
}

.close-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.close-btn:hover {
  color: #fff;
}

.panel-content {
  padding: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.tool-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.tool-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.icon {
  font-size: 20px;
}

.label {
  font-size: 11px;
  color: #ccc;
}

/* 动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
