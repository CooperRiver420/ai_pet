import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Efficiency Service', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  describe('Drink Reminder', () => {
    it('should call callback after interval', async () => {
      const { startDrinkReminder, stopDrinkReminder } = await import('./efficiency')
      const callback = vi.fn()
      
      startDrinkReminder(callback, 60)
      
      // Should not call immediately
      expect(callback).not.toHaveBeenCalled()
      
      // Advance past 60 minutes
      vi.advanceTimersByTime(60 * 60 * 1000 + 100)
      expect(callback).toHaveBeenCalledTimes(1)
      
      stopDrinkReminder()
    })

    it('should reset timer when called again', async () => {
      const { startDrinkReminder, stopDrinkReminder } = await import('./efficiency')
      const callback = vi.fn()
      
      startDrinkReminder(callback, 60)
      vi.advanceTimersByTime(30 * 60 * 1000)
      
      // Call again with different interval
      startDrinkReminder(callback, 30)
      
      vi.advanceTimersByTime(30 * 60 * 1000 + 100)
      expect(callback).toHaveBeenCalledTimes(1)
      
      stopDrinkReminder()
    })

    it('should stop drink reminder', async () => {
      const { startDrinkReminder, stopDrinkReminder } = await import('./efficiency')
      const callback = vi.fn()
      
      startDrinkReminder(callback)
      vi.advanceTimersByTime(60 * 60 * 1000 + 100)
      expect(callback).toHaveBeenCalledTimes(1)
      
      stopDrinkReminder()
      vi.advanceTimersByTime(60 * 60 * 1000)
      expect(callback).toHaveBeenCalledTimes(1) // No new calls
    })
  })

  describe('Pomodoro Timer', () => {
    it('should initialize with default state', async () => {
      const { getPomodoroState } = await import('./efficiency')
      const state = getPomodoroState()
      expect(state.isRunning).toBe(false)
      expect(state.remainingSeconds).toBe(25 * 60)
      expect(state.totalSeconds).toBe(25 * 60)
    })

    it('should start pomodoro and tick', async () => {
      const { startPomodoro, getPomodoroState } = await import('./efficiency')
      const onTick = vi.fn()
      
      startPomodoro(onTick, vi.fn())
      
      const state = getPomodoroState()
      expect(state.isRunning).toBe(true)
      
      // Advance 1 second
      vi.advanceTimersByTime(1000)
      expect(onTick).toHaveBeenCalled()
      expect(getPomodoroState().remainingSeconds).toBe(25 * 60 - 1)
    })

    it('should call onComplete when timer ends', async () => {
      const { startPomodoro, getPomodoroState } = await import('./efficiency')
      const onComplete = vi.fn()
      
      startPomodoro(vi.fn(), onComplete)
      
      // Fast forward to end (25 minutes)
      vi.advanceTimersByTime(25 * 60 * 1000 + 100)
      
      expect(onComplete).toHaveBeenCalled()
      expect(getPomodoroState().isRunning).toBe(false)
    })

    it('should stop pomodoro', async () => {
      const { startPomodoro, getPomodoroState, stopPomodoro } = await import('./efficiency')
      const onComplete = vi.fn()
      
      startPomodoro(vi.fn(), onComplete)
      vi.advanceTimersByTime(60 * 1000)
      
      stopPomodoro()
      
      expect(getPomodoroState().isRunning).toBe(false)
      expect(onComplete).not.toHaveBeenCalled()
    })

    it('should return copy of state from getPomodoroState', async () => {
      const { startPomodoro, getPomodoroState } = await import('./efficiency')
      
      startPomodoro(vi.fn(), vi.fn())
      vi.advanceTimersByTime(1000)
      
      const state = getPomodoroState()
      state.remainingSeconds = 0
      
      expect(getPomodoroState().remainingSeconds).not.toBe(0)
    })
  })

  describe('Clipboard', () => {
    it('should return true on successful copy', async () => {
      const { copyToClipboard } = await import('./efficiency')
      
      const mockWriteText = vi.fn().mockResolvedValue(undefined)
      Object.defineProperty(window, 'navigator', {
        value: { clipboard: { writeText: mockWriteText } },
        writable: true
      })
      
      const result = await copyToClipboard('test text')
      expect(result).toBe(true)
      expect(mockWriteText).toHaveBeenCalledWith('test text')
    })

    it('should return false on clipboard error', async () => {
      const { copyToClipboard } = await import('./efficiency')
      
      const mockWriteText = vi.fn().mockRejectedValue(new Error('Clipboard error'))
      Object.defineProperty(window, 'navigator', {
        value: { clipboard: { writeText: mockWriteText } },
        writable: true
      })
      
      const result = await copyToClipboard('test text')
      expect(result).toBe(false)
    })
  })
})
