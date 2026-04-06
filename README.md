# AI Pet - 像素宠物桌面应用

一个基于 Electron + Vue3 的像素宠物桌面宠物应用。

## 功能

- 🎮 像素宠物渲染（Canvas 2D）
- 🎨 多状态动画（Idle / Happy / Busy / Hungry）
- 🪟 透明悬浮窗（置顶显示）
- 🖱️ 拖拽移动
- 💾 位置持久化存储
- 🖥️ 系统托盘

## 技术栈

- **框架**: Electron 33
- **前端**: Vue 3 + TypeScript
- **构建**: Vite 6
- **状态**: Pinia
- **存储**: electron-store

## 环境要求

### 硬件要求

| 项目 | 最低要求 | 推荐 |
|------|---------|------|
| 内存 | 4GB | 8GB+ |
| 显卡 | 支持 OpenGL 2.0 | Intel HD 4000+ / AMD Radeon HD / NVIDIA GeForce 6+ |
| 显存 | 256MB | 512MB+ |

### 系统要求

- Windows 10+ / macOS 10.15+ / Ubuntu 18.04+ 或其他主流 Linux 发行版

### 已知兼容性问题

- **Intel Haswell (第4代) 及更早显卡**: 可能出现透明窗口渲染异常（白条/图形破碎）
  - 解决方案：禁用硬件加速或更新显卡驱动
  - 临时方案：启动时添加 `--disable-gpu` 参数

## 安装

```bash
# 安装依赖
npm install

# 开发模式运行
npm run dev

# 构建生产版本
npm run dist
```

## 开发

```bash
# 克隆项目
git clone https://github.com/CooperRiver420/ai_pet.git
cd ai_pet

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 启动参数

Electron 支持以下启动参数：

| 参数 | 说明 |
|------|------|
| `--disable-gpu` | 禁用 GPU 硬件加速（解决显卡兼容性问题） |
| `--no-sandbox` | 禁用沙箱（Linux 下可能需要） |

示例：
```bash
electron . --disable-gpu --no-sandbox
```

## 项目结构

```
ai_pet/
├── src/
│   ├── main/                 # Electron 主进程
│   │   ├── index.ts          # 入口
│   │   ├── window.ts         # 窗口管理
│   │   ├── tray.ts           # 系统托盘
│   │   ├── ipc.ts            # IPC 通信
│   │   └── store.ts          # electron-store 封装
│   ├── preload/              # 预加载脚本
│   │   └── index.ts
│   └── renderer/             # Vue3 前端
│       ├── main.ts
│       ├── App.vue
│       ├── components/
│       │   └── PetCanvas.vue  # 像素宠物渲染
│       └── assets/
│           └── sprites/       # 精灵图
├── package.json
└── vite.config.ts
```

## License

ISC
