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
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { SpriteSheet } from '@/utils/sprite'
import { PetState } from '@/utils/petState'

const props = defineProps<{
  spriteSrc: string
  state: PetState
  scale?: number
}>()

const emit = defineEmits<{
  click: []
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvasWidth = 64
const canvasHeight = 64
const scale = computed(() => props.scale ?? 2)
const isLoading = ref(true)

const containerStyle = computed(() => ({
  width: `${canvasWidth}px`,
  height: `${canvasHeight}px`,
  position: 'absolute' as const,
  left: '0px',
  top: '0px',
  pointerEvents: 'auto' as const
}))

let sprite: SpriteSheet | null = null
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

function onClick() {
  emit('click')
}

async function initSprite() {
  if (!props.spriteSrc || !canvasRef.value) return
  
  try {
    sprite = new SpriteSheet(props.spriteSrc, 32, 32, 4)
    await sprite.load()
    isLoading.value = false
    console.log('Sprite loaded successfully')
  } catch (e) {
    console.error('Failed to load sprite:', e)
  }
}

onMounted(() => {
  initSprite()
  animationFrameId = requestAnimationFrame(render)
})

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
})

watch(() => props.spriteSrc, async (newSrc) => {
  if (newSrc) {
    isLoading.value = true
    sprite = new SpriteSheet(newSrc, 32, 32, 4)
    await sprite.load()
    isLoading.value = false
    currentFrame = 0
  }
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
