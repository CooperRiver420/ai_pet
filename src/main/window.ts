import { BrowserWindow, screen } from 'electron'
import { join } from 'path'

export class PetWindow {
  private window: BrowserWindow | null = null
  private x = 100
  private y = 100

  create() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize

    this.window = new BrowserWindow({
      width: 800,
      height: 600,
      x: this.x,
      y: this.y,
      frame: false,                    // 无边框
      transparent: true,               // 透明背景
      alwaysOnTop: true,                // 置顶
      resizable: false,                 // 不可调整大小
      skipTaskbar: true,                // 不显示在任务栏
      focusable: false,                 // 不可聚焦（避免干扰）
      hasShadow: false,                 // 无阴影
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        contextIsolation: true,
        nodeIntegration: false
      }
    })

    // 透明背景 + 鼠标穿透
    this.window.setIgnoreMouseEvents(false)

    // 加载页面
    if (process.env.VITE_DEV_SERVER_URL) {
      this.window.loadURL(process.env.VITE_DEV_SERVER_URL)
    } else {
      this.window.loadFile(join(__dirname, '../../dist/index.html'))
    }

    // 注册拖拽事件（从渲染进程 IPC）
    this.setupDrag()
  }

  private setupDrag() {
    this.window?.on('moved', () => {
      const [x, y] = this.window?.getPosition() ?? [0, 0]
      this.x = x
      this.y = y
    })
  }

  getPosition() {
    return { x: this.x, y: this.y }
  }

  setPosition(x: number, y: number) {
    this.window?.setPosition(x, y)
    this.x = x
    this.y = y
  }

  getWindow() {
    return this.window
  }

  show() {
    this.window?.show()
  }

  hide() {
    this.window?.hide()
  }
}
