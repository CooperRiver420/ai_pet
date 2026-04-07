import { describe, it, expect } from 'vitest'
import { 
  allPets, 
  randomPet, 
  getRarityColor,
  PetData 
} from './pets'

describe('Pets Data Module', () => {
  describe('allPets', () => {
    it('should contain all defined pets', () => {
      expect(allPets).toHaveLength(6)
    })

    it('should have valid pet structure', () => {
      allPets.forEach(pet => {
        expect(pet).toHaveProperty('id')
        expect(pet).toHaveProperty('name')
        expect(pet).toHaveProperty('type')
        expect(pet).toHaveProperty('rarity')
        expect(pet).toHaveProperty('sprite')
        expect(pet).toHaveProperty('description')
      })
    })

    it('should have correct rarity values', () => {
      const validRarities = ['common', 'rare', 'epic', 'legendary']
      allPets.forEach(pet => {
        expect(validRarities).toContain(pet.rarity)
      })
    })
  })

  describe('randomPet', () => {
    it('should return a valid PetData', () => {
      const pet = randomPet()
      expect(pet).toHaveProperty('id')
      expect(pet).toHaveProperty('name')
      expect(typeof pet.name).toBe('string')
    })

    it('should return pet from allPets', () => {
      for (let i = 0; i < 100; i++) {
        const pet = randomPet()
        expect(allPets.map(p => p.id)).toContain(pet.id)
      }
    })

    it('should respect probability distribution over many samples', () => {
      // 统计 10000 次的概率分布
      const counts = { legendary: 0, epic: 0, rare: 0, common: 0 }
      const iterations = 10000
      
      for (let i = 0; i < iterations; i++) {
        const pet = randomPet()
        counts[pet.rarity]++
      }
      
      // legendary: ~5%, epic: ~10%, rare: ~25%, common: ~60%
      // 允许一定误差
      expect(counts.legendary).toBeGreaterThan(200)   // > 2%
      expect(counts.epic).toBeGreaterThan(500)         // > 5%
      expect(counts.rare).toBeGreaterThan(1500)        // > 15%
      expect(counts.common).toBeGreaterThan(4000)      // > 40%
    })
  })

  describe('getRarityColor', () => {
    it('should return gold for legendary', () => {
      expect(getRarityColor('legendary')).toBe('#FFD700')
    })

    it('should return purple for epic', () => {
      expect(getRarityColor('epic')).toBe('#9B59B6')
    })

    it('should return blue for rare', () => {
      expect(getRarityColor('rare')).toBe('#3498DB')
    })

    it('should return gray for common', () => {
      expect(getRarityColor('common')).toBe('#95A5A6')
    })

    it('should return gray for unknown rarity', () => {
      expect(getRarityColor('unknown')).toBe('#95A5A6')
    })
  })
})
