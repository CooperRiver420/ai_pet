import { BrowserWindow, screen } from 'electron'
import { join } from 'path'

export class PetWindow {
  private window: BrowserWindow | null = null
  private x = 100
  private y = 100
  private petWidth = 64
  private petHeight = 64

  create(): BrowserWindow {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize

    this.window = new BrowserWindow({
      width: this.petWidth,
      height: this.petHeight,
      x: this.x,
      y: this.y,
      frame: false,                    // 无边框
      transparent: true,               // 透明背景
      alwaysOnTop: true,                // 置顶
      resizable: false,                 // 不可调整大小
      skipTaskbar: true,               // 不显示在任务栏
      focusable: false,                // 不可聚焦
      hasShadow: false,                // 无阴影
      show: false,                     // 启动时隐藏，等加载完再显示
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        contextIsolation: true,
        nodeIntegration: false
      }
    })

    // 设置窗口不规则形状（透明区域穿透）
    this.window.setIgnoreMouseEvents(false)

    // 等页面加载完成后再显示窗口
    this.window.once('ready-to-show', () => {
      this.window?.show()
    })

    // 加载页面
    if (process.env.VITE_DEV_SERVER_URL) {
      this.window.loadURL(process.env.VITE_DEV_SERVER_URL)
    } else {
      this.window.loadFile(join(__dirname, '../../dist/index.html'))
    }

    // 保存位置变化
    this.setupDrag()

    return this.window
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
