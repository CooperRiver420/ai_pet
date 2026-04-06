import { app, BrowserWindow } from 'electron'
import { PetWindow } from './window'
import { PetTray } from './tray'
import { setupIPC } from './ipc'
import { store } from './store'

let petWindow: PetWindow
let petTray: PetTray

app.whenReady().then(() => {
  petWindow = new PetWindow()
  const win = petWindow.create()

  petTray = new PetTray()
  petTray.create(win)

  setupIPC(petWindow)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      petWindow.create()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
