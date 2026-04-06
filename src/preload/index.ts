import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
  getPetPosition: () => ipcRenderer.invoke('get-pet-position'),
  setPetPosition: (x: number, y: number) => ipcRenderer.invoke('set-pet-position', x, y),
  getPets: () => ipcRenderer.invoke('get-pets')
})

// TypeScript 类型声明
declare global {
  interface Window {
    electronAPI: {
      platform: string
      versions: {
        node: string
        chrome: string
        electron: string
      }
      getPetPosition: () => Promise<{ x: number; y: number }>
      setPetPosition: (x: number, y: number) => Promise<boolean>
      getPets: () => Promise<Array<{
        id: string
        name: string
        type: string
        unlocked: boolean
      }>>
    }
  }
}
