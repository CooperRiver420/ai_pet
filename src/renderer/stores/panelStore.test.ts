import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Setup Pinia before each test
beforeEach(() => {
  setActivePinia(createPinia())
})

describe('Panel Store', () => {
  it('should initialize with panel hidden', async () => {
    const { usePanelStore } = await import('./panelStore')
    const store = usePanelStore()
    expect(store.isPanelVisible).toBe(false)
  })

  it('should toggle panel visibility', async () => {
    const { usePanelStore } = await import('./panelStore')
    const store = usePanelStore()
    store.togglePanel()
    expect(store.isPanelVisible).toBe(true)
    store.togglePanel()
    expect(store.isPanelVisible).toBe(false)
  })

  it('should show panel explicitly', async () => {
    const { usePanelStore } = await import('./panelStore')
    const store = usePanelStore()
    store.showPanel()
    expect(store.isPanelVisible).toBe(true)
  })

  it('should hide panel explicitly', async () => {
    const { usePanelStore } = await import('./panelStore')
    const store = usePanelStore()
    store.isPanelVisible = true
    store.hidePanel()
    expect(store.isPanelVisible).toBe(false)
  })
})
