export interface SpriteFrame {
  image: HTMLImageElement
  width: number
  height: number
}

export class SpriteSheet {
  private image: HTMLImageElement
  private frameWidth: number
  private frameHeight: number
  private frameCount: number
  private loaded = false

  constructor(imageSrc: string, frameWidth: number, frameHeight: number, frameCount: number) {
    this.image = new Image()
    this.image.src = imageSrc
    this.frameWidth = frameWidth
    this.frameHeight = frameHeight
    this.frameCount = frameCount
  }

  // 等待图片加载完成
  async load(): Promise<void> {
    if (this.loaded) return
    return new Promise((resolve, reject) => {
      this.image.onload = () => {
        this.loaded = true
        resolve()
      }
      this.image.onerror = () => {
        console.error('Failed to load sprite image:', this.image.src)
        reject(new Error('Image load failed'))
      }
    })
  }

  isLoaded(): boolean {
    return this.loaded
  }

  getFrame(index: number): SpriteFrame {
    return {
      image: this.image,
      width: this.frameWidth,
      height: this.frameHeight
    }
  }

  drawFrame(ctx: CanvasRenderingContext2D, frameIndex: number, x: number, y: number, scale: number = 2) {
    if (!this.loaded) return  // 图片未加载不绘制
    const frame = this.getFrame(frameIndex)
    ctx.drawImage(
      frame.image,
      frameIndex * this.frameWidth, 0,
      this.frameWidth, this.frameHeight,
      x, y,
      this.frameWidth * scale, this.frameHeight * scale
    )
  }
}
