// MiniMax API 配置
interface LLMConfig {
  baseURL: string
  apiKey: string
  model: string
  maxTokens: number
  temperature: number
}

// 从 localStorage 获取配置（用户输入的 API Key）
function getConfig(): LLMConfig {
  const apiKey = localStorage.getItem('minimax_api_key') || ''
  return {
    baseURL: 'https://api.minimax.chat/v1',
    apiKey,
    model: 'MiniMax-Text-01',
    maxTokens: 2048,
    temperature: 0.8
  }
}

export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

// 调用 MiniMax API
export async function chat(messages: Message[]): Promise<string> {
  const config = getConfig()

  if (!config.apiKey) {
    throw new Error('请先设置 MiniMax API Key')
  }

  const response = await fetch(`${config.baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      max_tokens: config.maxTokens,
      temperature: config.temperature
    })
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error?.message || `API 请求失败: ${response.status}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

// 保存 API Key
export function saveApiKey(key: string): void {
  localStorage.setItem('minimax_api_key', key)
}

// 获取 API Key
export function getApiKey(): string {
  return localStorage.getItem('minimax_api_key') || ''
}
