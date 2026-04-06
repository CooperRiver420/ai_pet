import Store from 'electron-store'
import { createHash } from 'crypto'

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

// 动态生成加密密钥（基于机器ID + 时间戳种子）
function generateEncryptionKey(): string {
  const seed = `${process.platform}-${process.arch}-ai-pet-2026`
  return createHash('sha256').update(seed).digest('hex').substring(0, 32)
}

export const store = new Store<PetStoreSchema>({
  name: 'ai-pet-config',
  encryptionKey: generateEncryptionKey(),
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
