import Store from 'electron-store'

interface PetStoreSchema {
  petPosition: { x: number; y: number }
  pets: Array<{
    id: string
    name: string
    type: string
    unlocked: boolean
  }>
  settings: {
    scale: number
    frameRate: number
  }
}

export const store = new Store<PetStoreSchema>({
  name: 'ai-pet-config',
  encryptionKey: 'ai-pet-secure-key-2026',  // 简单加密
  defaults: {
    petPosition: { x: 100, y: 100 },
    pets: [
      { id: 'cat_001', name: '小橘', type: 'cat', unlocked: true }
    ],
    settings: { scale: 2, frameRate: 10 }
  }
})

export function getPetPosition() {
  return store.get('petPosition', { x: 100, y: 100 })
}

export function setPetPosition(x: number, y: number) {
  store.set('petPosition', { x, y })
}
