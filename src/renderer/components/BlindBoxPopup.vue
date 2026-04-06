<template>
  <Transition name="scale">
    <div v-if="visible" class="blindbox-overlay" @click.self="$emit('close')">
      <div class="blindbox-container">
        <div class="blindbox-header">
          <span>🎁 盲盒抽取</span>
          <button class="close-btn" @click="$emit('close')">×</button>
        </div>
        
        <div class="blindbox-content">
          <!-- 抽奖动画区域 -->
          <div v-if="!result" class="lottery-area">
            <div class="lottery-box">?</div>
            <p>点击按钮抽取盲盒</p>
          </div>
          
          <!-- 结果展示 -->
          <div v-else class="result-area">
            <div 
              class="pet-card"
              :style="{ borderColor: getRarityColor(result.rarity) }"
            >
              <div class="pet-icon">🐱</div>
              <div class="pet-name">{{ result.name }}</div>
              <div 
                class="pet-rarity"
                :style="{ color: getRarityColor(result.rarity) }"
              >
                {{ result.rarity }}
              </div>
              <div class="pet-desc">{{ result.description }}</div>
            </div>
          </div>
        </div>
        
        <div class="blindbox-footer">
          <button 
            v-if="!result" 
            class="lottery-btn"
            @click="doLottery"
            :disabled="isLotting"
          >
            {{ isLotting ? '抽取中...' : '抽取' }}
          </button>
          <button 
            v-else 
            class="close-result-btn"
            @click="$emit('close')"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { randomPet, getRarityColor, PetData } from '@/data/pets'

defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const result = ref<PetData | null>(null)
const isLotting = ref(false)

function doLottery() {
  isLotting.value = true
  
  // 模拟抽奖动画
  let count = 0
  const interval = setInterval(() => {
    result.value = randomPet()
    count++
    if (count > 10) {
      clearInterval(interval)
      result.value = randomPet() // 最终结果
      isLotting.value = false
    }
  }, 100)
}
</script>

<style scoped>
.blindbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20002;
}

.blindbox-container {
  width: 280px;
  background: rgba(30, 30, 50, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.blindbox-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
}

.close-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 20px;
  cursor: pointer;
}

.blindbox-content {
  padding: 24px;
  text-align: center;
  color: #fff;
}

.lottery-area p {
  margin-top: 16px;
  color: #888;
  font-size: 13px;
}

.lottery-box {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  margin: 0 auto;
  animation: bounce 0.5s infinite alternate;
}

@keyframes bounce {
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}

.pet-card {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  border: 2px solid;
  padding: 20px;
}

.pet-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

.pet-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.pet-rarity {
  font-size: 12px;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.pet-desc {
  font-size: 13px;
  color: #aaa;
}

.blindbox-footer {
  padding: 16px;
  text-align: center;
}

.lottery-btn, .close-result-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
}

.lottery-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: #fff;
}

.lottery-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.close-result-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #ccc;
}

/* 动画 */
.scale-enter-active, .scale-leave-active {
  transition: all 0.3s ease;
}
.scale-enter-from, .scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
