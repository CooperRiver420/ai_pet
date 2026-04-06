import { ipcMain } from 'electron'
import { getPetPosition, setPetPosition, store } from './store'
import { PetWindow } from './window'

export function setupIPC(petWindow: PetWindow) {
  // 获取宠物位置
  ipcMain.handle('get-pet-position', () => {
    return getPetPosition()
  })

  // 设置宠物位置
  ipcMain.handle('set-pet-position', (_, x: number, y: number) => {
    setPetPosition(x, y)
    petWindow.setPosition(x, y)
    return true
  })

  // 获取宠物列表
  ipcMain.handle('get-pets', () => {
    return store.get('pets', [])
  })
}
