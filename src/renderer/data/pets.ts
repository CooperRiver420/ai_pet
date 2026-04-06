export interface PetData {
  id: string
  name: string
  type: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  sprite: string
  description: string
}

export const allPets: PetData[] = [
  { id: 'cat_001', name: '小橘', type: 'cat', rarity: 'common', sprite: 'cat_idle', description: '普通的橘猫' },
  { id: 'cat_002', name: '布偶', type: 'cat', rarity: 'rare', sprite: 'cat_happy', description: '温柔的布偶猫' },
  { id: 'dog_001', name: '柴犬', type: 'dog', rarity: 'common', sprite: 'cat_idle', description: '傻乎乎的柴犬' },
  { id: 'dog_002', name: '金毛', type: 'dog', rarity: 'rare', sprite: 'cat_happy', description: '暖男金毛' },
  { id: 'rabbit_001', name: '小白', type: 'rabbit', rarity: 'epic', sprite: 'cat_idle', description: '可爱的小白兔' },
  { id: 'dragon_001', name: '小蓝龙', type: 'dragon', rarity: 'legendary', sprite: 'cat_happy', description: '稀有的蓝龙！' },
]

export function randomPet(): PetData {
  // 概率：common 60%, rare 25%, epic 10%, legendary 5%
  const rand = Math.random() * 100
  let rarity: string
  
  if (rand < 5) {
    rarity = 'legendary'
  } else if (rand < 15) {
    rarity = 'epic'
  } else if (rand < 40) {
    rarity = 'rare'
  } else {
    rarity = 'common'
  }
  
  const filtered = allPets.filter(p => p.rarity === rarity)
  return filtered[Math.floor(Math.random() * filtered.length)]
}

export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case 'legendary': return '#FFD700' // 金色
    case 'epic': return '#9B59B6' // 紫色
    case 'rare': return '#3498DB' // 蓝色
    default: return '#95A5A6' // 灰色
  }
}
