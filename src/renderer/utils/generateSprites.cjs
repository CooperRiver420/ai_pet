/**
 * generateSprites.cjs
 * 
 * 生成像素宠物精灵图占位资源
 * 运行: node src/renderer/utils/generateSprites.cjs
 */

const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

const OUTPUT_DIR = path.join(__dirname, '../assets/sprites')

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

const COLORS = {
  idle: [
    [255, 200, 150, 255],
    [255, 160, 100, 255],
    [220, 120, 60, 255],
    [180, 80, 30, 255],
    [255, 255, 255, 255],
    [50, 50, 50, 255],
  ],
  happy: [
    [255, 220, 180, 255],
    [255, 180, 120, 255],
    [240, 140, 80, 255],
    [160, 70, 20, 255],
    [255, 255, 255, 255],
    [50, 50, 50, 255],
  ],
  busy: [
    [255, 190, 140, 255],
    [250, 150, 90, 255],
    [200, 100, 50, 255],
    [140, 60, 20, 255],
    [255, 255, 255, 255],
    [50, 50, 50, 255],
  ],
  hungry: [
    [230, 170, 130, 255],
    [200, 130, 80, 255],
    [160, 90, 40, 255],
    [120, 50, 20, 255],
    [200, 200, 200, 255],
    [80, 80, 80, 255],
  ]
}

const FRAME_WIDTH = 32
const FRAME_HEIGHT = 32
const FRAME_COUNT = 4

function generateCatSpriteData(type) {
  const colors = COLORS[type]
  const frames = []
  
  for (let f = 0; f < FRAME_COUNT; f++) {
    const frame = []
    for (let y = 0; y < FRAME_HEIGHT; y++) {
      const row = []
      for (let x = 0; x < FRAME_WIDTH; x++) {
        row.push(-1)
      }
      frame.push(row)
    }
    
    for (let y = 12; y < 28; y++) {
      for (let x = 8; x < 24; x++) {
        frame[y][x] = 1
      }
    }
    
    for (let y = 4; y < 14; y++) {
      for (let x = 6; x < 26; x++) {
        frame[y][x] = 1
      }
    }
    
    frame[2][8] = 2; frame[3][8] = 2; frame[4][8] = 2
    frame[2][9] = 2; frame[3][9] = 2; frame[4][9] = 2
    frame[2][22] = 2; frame[3][22] = 2; frame[4][22] = 2
    frame[2][23] = 2; frame[3][23] = 2; frame[4][23] = 2
    
    for (let i = 0; i < 6; i++) {
      const ty = 14 + i
      const tx = 24 + (i > 2 ? 1 : 0)
      if (ty < FRAME_HEIGHT && tx < FRAME_WIDTH) {
        frame[ty][tx] = 1
      }
    }
    
    if (type === 'hungry') {
      frame[7][10] = 4; frame[7][11] = 4
      frame[8][10] = 4; frame[8][11] = 5
      frame[7][20] = 4; frame[7][21] = 4
      frame[8][20] = 5; frame[8][21] = 4
    } else if (type === 'happy') {
      frame[7][10] = 4; frame[7][11] = 4
      frame[8][10] = 5; frame[8][11] = 4
      frame[7][20] = 4; frame[7][21] = 4
      frame[8][20] = 4; frame[8][21] = 5
    } else {
      frame[7][10] = 4; frame[7][11] = 4
      frame[8][10] = 5; frame[8][11] = 5
      frame[7][20] = 4; frame[7][21] = 4
      frame[8][20] = 5; frame[8][21] = 5
    }
    
    frame[11][15] = 2; frame[11][16] = 2
    frame[12][15] = 2; frame[12][16] = 2
    
    const legOffset = f % 2 === 0 ? 0 : 1
    for (let i = 0; i < 4; i++) {
      frame[26][10 + i * 3 + legOffset] = 2
      frame[27][10 + i * 3 + legOffset] = 2
    }
    
    frames.push(frame)
  }
  
  return frames
}

function createPNG(width, height, rgbaData) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  
  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(width, 0)
  ihdrData.writeUInt32BE(height, 4)
  ihdrData[8] = 8
  ihdrData[9] = 6
  ihdrData[10] = 0
  ihdrData[11] = 0
  ihdrData[12] = 0
  const ihdr = createChunk('IHDR', ihdrData)
  
  const rawData = Buffer.alloc(height * (1 + width * 4))
  for (let y = 0; y < height; y++) {
    rawData[y * (1 + width * 4)] = 0
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * 4
      const dstIdx = y * (1 + width * 4) + 1 + x * 4
      rawData[dstIdx] = rgbaData[srcIdx]
      rawData[dstIdx + 1] = rgbaData[srcIdx + 1]
      rawData[dstIdx + 2] = rgbaData[srcIdx + 2]
      rawData[dstIdx + 3] = rgbaData[srcIdx + 3]
    }
  }
  
  const compressed = zlib.deflateSync(rawData, { level: 9 })
  const idat = createChunk('IDAT', compressed)
  const iend = createChunk('IEND', Buffer.alloc(0))
  
  return Buffer.concat([signature, ihdr, idat, iend])
}

function createChunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length, 0)
  const typeBuffer = Buffer.from(type, 'ascii')
  const crcData = Buffer.concat([typeBuffer, data])
  const crc = crc32(crcData)
  const crcBuffer = Buffer.alloc(4)
  crcBuffer.writeUInt32BE(crc >>> 0, 0)
  return Buffer.concat([length, typeBuffer, data, crcBuffer])
}

let crc32Table = null
function getCrc32Table() {
  if (crc32Table) return crc32Table
  crc32Table = []
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
    }
    crc32Table.push(c)
  }
  return crc32Table
}

function crc32(data) {
  let crc = 0xFFFFFFFF
  const table = getCrc32Table()
  for (let i = 0; i < data.length; i++) {
    crc = table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8)
  }
  return crc ^ 0xFFFFFFFF
}

function generateSprite(type, filename) {
  const frames = generateCatSpriteData(type)
  const colors = COLORS[type]
  
  const totalWidth = FRAME_WIDTH * FRAME_COUNT
  const totalHeight = FRAME_HEIGHT
  
  const rgbaData = Buffer.alloc(totalWidth * totalHeight * 4, 0)
  
  for (let f = 0; f < FRAME_COUNT; f++) {
    const frame = frames[f]
    for (let y = 0; y < FRAME_HEIGHT; y++) {
      for (let x = 0; x < FRAME_WIDTH; x++) {
        const colorIdx = frame[y][x]
        const dstX = f * FRAME_WIDTH + x
        const dstIdx = (y * totalWidth + dstX) * 4
        
        if (colorIdx >= 0 && colorIdx < colors.length) {
          const [r, g, b, a] = colors[colorIdx]
          rgbaData[dstIdx] = r
          rgbaData[dstIdx + 1] = g
          rgbaData[dstIdx + 2] = b
          rgbaData[dstIdx + 3] = a
        }
      }
    }
  }
  
  const png = createPNG(totalWidth, totalHeight, rgbaData)
  const outputPath = path.join(OUTPUT_DIR, filename)
  fs.writeFileSync(outputPath, png)
  console.log(`生成: ${outputPath}`)
}

console.log('开始生成精灵图...')
console.log(`输出目录: ${OUTPUT_DIR}`)

generateSprite('idle', 'cat_idle.png')
generateSprite('happy', 'cat_happy.png')
generateSprite('busy', 'cat_busy.png')
generateSprite('hungry', 'cat_hungry.png')

console.log('完成!')
