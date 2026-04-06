// 效率工具服务

// ========== 喝水提醒 ==========
let drinkWaterTimer: number | null = null

export function startDrinkReminder(callback: () => void, intervalMinutes = 60) {
  stopDrinkReminder()
  drinkWaterTimer = window.setInterval(() => {
    callback()
  }, intervalMinutes * 60 * 1000)
}

export function stopDrinkReminder() {
  if (drinkWaterTimer) {
    clearInterval(drinkWaterTimer)
    drinkWaterTimer = null
  }
}

// ========== 番茄钟 ==========
interface PomodoroState {
  isRunning: boolean
  remainingSeconds: number
  totalSeconds: number
  onTick: ((state: PomodoroState) => void) | null
  onComplete: (() => void) | null
}

let pomodoroTimer: number | null = null
let pomodoroState: PomodoroState = {
  isRunning: false,
  remainingSeconds: 25 * 60,
  totalSeconds: 25 * 60,
  onTick: null,
  onComplete: null
}

export function startPomodoro(
  onTick: (state: PomodoroState) => void,
  onComplete: () => void
) {
  pomodoroState = {
    isRunning: true,
    remainingSeconds: 25 * 60,
    totalSeconds: 25 * 60,
    onTick,
    onComplete
  }
  
  pomodoroTimer = window.setInterval(() => {
    pomodoroState.remainingSeconds--
    pomodoroState.onTick?.(pomodoroState)
    
    if (pomodoroState.remainingSeconds <= 0) {
      stopPomodoro()
      pomodoroState.onComplete?.()
    }
  }, 1000)
}

export function stopPomodoro() {
  if (pomodoroTimer) {
    clearInterval(pomodoroTimer)
    pomodoroTimer = null
  }
  pomodoroState.isRunning = false
}

export function getPomodoroState(): PomodoroState {
  return { ...pomodoroState }
}

// ========== TTS 播报 ==========
export function speak(text: string) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-CN'
    utterance.rate = 1.0
    utterance.pitch = 1.0
    window.speechSynthesis.speak(utterance)
  }
}

// ========== 剪贴板 ==========
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
