import { 
  startDrinkReminder, 
  stopDrinkReminder,
  startPomodoro, 
  stopPomodoro,
  speak,
  copyToClipboard 
} from './efficiency'

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
    speak('喝水时间到了！记得多喝水哦～')
    startDrinkReminder(() => {
      speak('喝水时间到了！')
    }, 60)
  }
  
  private pomodoro() {
    speak('番茄钟开始，专注25分钟！')
    startPomodoro(
      (state) => {
        // 每分钟播报一次
        if (state.remainingSeconds % 60 === 0) {
          const mins = Math.floor(state.remainingSeconds / 60)
          if (mins > 0) {
            console.log(`番茄钟剩余 ${mins} 分钟`)
          }
        }
      },
      () => {
        speak('番茄钟结束！休息一下吧～')
      }
    )
  }
  
  private async quickCopy() {
    const text = 'Hello from AI Pet!'
    const success = await copyToClipboard(text)
    if (success) {
      speak('已复制到剪贴板')
    }
  }
  
  private scheduleAnnounce() {
    const now = new Date()
    const hour = now.getHours()
    const minute = now.getMinutes()
    speak(`现在是${hour}点${minute}分，今天没有日程安排`)
  }
  
  private blindbox() {
    speak('盲盒功能即将上线，敬请期待！')
  }
}

export const workflowExecutor = new WorkflowExecutor()
