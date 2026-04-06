// 工作流类型
export type WorkflowType = 
  | 'drink_water' 
  | 'pomodoro' 
  | 'quick_copy'
  | 'schedule_announce'
  | 'blindbox'

// 工作流定义
export interface Workflow {
  type: WorkflowType
  name: string
  icon: string
  description: string
  shortcut?: string
}

export const workflows: Workflow[] = [
  {
    type: 'drink_water',
    name: '喝水提醒',
    icon: '💧',
    description: '设置喝水提醒'
  },
  {
    type: 'pomodoro',
    name: '番茄钟',
    icon: '🍅',
    description: '启动25分钟专注计时'
  },
  {
    type: 'quick_copy',
    name: '快捷复制',
    icon: '📋',
    description: '快速复制常用内容'
  },
  {
    type: 'schedule_announce',
    name: '日程播报',
    icon: '📅',
    description: '播报今日日程'
  },
  {
    type: 'blindbox',
    name: '盲盒抽取',
    icon: '🎁',
    description: '抽取随机宠物'
  }
]

// 工作流执行器
export class WorkflowExecutor {
  execute(type: WorkflowType): void {
    switch (type) {
      case 'drink_water':
        this.drinkWater()
        break
      case 'pomodoro':
        this.pomodoro()
        break
      case 'quick_copy':
        this.quickCopy()
        break
      case 'schedule_announce':
        this.scheduleAnnounce()
        break
      case 'blindbox':
        this.blindbox()
        break
    }
  }
  
  private drinkWater() {
    console.log('💧 喝水提醒触发')
    // TODO: M4 实现
  }
  
  private pomodoro() {
    console.log('🍅 番茄钟触发')
    // TODO: M4 实现
  }
  
  private quickCopy() {
    console.log('📋 快捷复制触发')
    // TODO: M4 实现
  }
  
  private scheduleAnnounce() {
    console.log('📅 日程播报触发')
    // TODO: M4 实现
  }
  
  private blindbox() {
    console.log('🎁 盲盒抽取触发')
    // TODO: M5 实现
  }
}

export const workflowExecutor = new WorkflowExecutor()
