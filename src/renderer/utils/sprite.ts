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

  constructor(imageSrc: string, frameWidth: number, frameHeight: number, frameCount: number) {
    this.image = new Image()
    this.image.src = imageSrc
    this.frameWidth = frameWidth
    this.frameHeight = frameHeight
    this.frameCount = frameCount
  }

  getFrame(index: number): SpriteFrame {
    return {
      image: this.image,
      width: this.frameWidth,
      height: this.frameHeight
    }
  }

  drawFrame(ctx: CanvasRenderingContext2D, frameIndex: number, x: number, y: number, scale: number = 2) {
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
