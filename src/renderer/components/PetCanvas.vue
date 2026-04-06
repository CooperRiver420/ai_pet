<template>
  <div class="pet-canvas-container" :style="containerStyle">
    <canvas 
      ref="canvasRef" 
      :width="canvasWidth" 
      :height="canvasHeight"
      @click="onClick"
      :style="{ imageRendering: 'pixelated' }"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { SpriteSheet } from '@/utils/sprite'
import { PetState } from '@/utils/petState'

// Props - 不再需要 spriteSrc 和 state，由内部管理
const props = defineProps<{
  scale?: number
}>()

const emit = defineEmits<{
  click: []
}>()

// Canvas refs
const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvasWidth = 64
const canvasHeight = 64
const scale = computed(() => props.scale ?? 2)

// 动画状态管理
const currentState = ref<PetState>(PetState.Idle)
const isPlayingReaction = ref(false)

// 精灵图URL映射
const spriteUrlMap: Record<PetState, string> = {
  [PetState.Idle]: '/src/renderer/assets/sprites/cat_idle.png',
  [PetState.Happy]: '/src/renderer/assets/sprites/cat_happy.png',
  [PetState.Busy]: '/src/renderer/assets/sprites/cat_busy.png',
  [PetState.Hungry]: '/src/renderer/assets/sprites/cat_hungry.png',
  [PetState.Reaction]: '/src/renderer/assets/sprites/cat_idle.png'
}

// 精灵图实例映射
const spriteMap: Partial<Record<PetState, SpriteSheet>> = {}

const currentSprite = computed(() => spriteMap[currentState.value])

const containerStyle = computed(() => ({
  width: `${canvasWidth}px`,
  height: `${canvasHeight}px`,
  position: 'absolute' as const,
  left: '0px',
  top: '0px',
  pointerEvents: 'auto' as const
}))

let animationFrameId: number | null = null
let currentFrame = 0
let lastFrameTime = 0
const frameInterval = 100 // ms per frame (~10fps)

function render(timestamp: number) {
  if (!canvasRef.value) return
  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) return

  // Clear
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  // Draw current frame
  const sprite = spriteMap[currentState.value]
  if (sprite && sprite.isLoaded()) {
    sprite.drawFrame(ctx, currentFrame, 0, 0, scale.value)
  }

  // Update frame
  if (timestamp - lastFrameTime > frameInterval) {
    currentFrame = (currentFrame + 1) % 4
    lastFrameTime = timestamp
  }

  animationFrameId = requestAnimationFrame(render)
}

// 状态切换 - 对外暴露
function setState(state: PetState) {
  if (isPlayingReaction.value && state !== PetState.Idle) return
  currentState.value = state
  console.log('Pet state changed to:', state)
}

// 点击触发 Reaction
function onClick() {
  if (isPlayingReaction.value) return
  isPlayingReaction.value = true
  currentState.value = PetState.Reaction
  console.log('Reaction triggered')
  
  // 400ms 后返回 Idle
  setTimeout(() => {
    currentState.value = PetState.Idle
    isPlayingReaction.value = false
    console.log('Reaction ended, back to Idle')
  }, 400)
  
  emit('click')
}

// 加载所有精灵图
async function loadAllSprites() {
  const loadPromises = Object.entries(spriteUrlMap).map(async ([state, url]) => {
    const sprite = new SpriteSheet(url, 32, 32, 4)
    await sprite.load()
    spriteMap[state as PetState] = sprite
    console.log(`Sprite loaded for state: ${state}`)
  })
  
  await Promise.all(loadPromises)
  console.log('All sprites loaded')
}

onMounted(async () => {
  await loadAllSprites()
  animationFrameId = requestAnimationFrame(render)
})

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
})

// 对外暴露方法
defineExpose({
  setState
})
</script>

<style scoped>
.pet-canvas-container {
  user-select: none;
  cursor: pointer;
}
canvas {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
</style>
