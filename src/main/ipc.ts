import { ipcMain, screen } from 'electron'
import { getPetPosition, setPetPosition, store } from './store'
import { PetWindow } from './window'

// 坐标边界校验（防止窗口移出屏幕）
function validatePosition(x: number, y: number): { x: number; y: number } {
  const display = screen.getPrimaryDisplay()
  const { width: screenWidth, height: screenHeight } = display.workAreaSize
  
  // 限制在屏幕范围内（留 100px 边界）
  const boundary = 100
  const maxX = screenWidth - boundary
  const maxY = screenHeight - boundary
  
  return {
    x: Math.max(boundary, Math.min(maxX, x)),
    y: Math.max(boundary, Math.min(maxY, y))
  }
}

export function setupIPC(petWindow: PetWindow) {
  // 获取宠物位置
  ipcMain.handle('get-pet-position', () => {
    return getPetPosition()
  })

  // 设置宠物位置（带边界校验）
  ipcMain.handle('set-pet-position', (_, x: number, y: number) => {
    // 类型校验
    if (typeof x !== 'number' || typeof y !== 'number') {
      return { success: false, error: 'Invalid coordinates' }
    }
    
    // 边界校验
    const validPos = validatePosition(x, y)
    setPetPosition(validPos.x, validPos.y)
    petWindow.setPosition(validPos.x, validPos.y)
    
    return { success: true, position: validPos }
  })

  // 获取宠物列表
  ipcMain.handle('get-pets', () => {
    return store.get('pets', [])
  })
}
