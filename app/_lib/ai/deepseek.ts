/** @format */

import { createHmac } from 'node:crypto'
import OpenAI from 'openai'

// export const deepseekModel = 'deepseek-chat'
export const deepseekModel = 'deepseek-v4-pro'

export const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
})

export function encodeDeepseekUserId(userId: string): string {
  const secret = process.env.JWT_SECRET ?? process.env.DEEPSEEK_API_KEY

  if (!secret) {
    throw new Error('环境变量 JWT_SECRET 或 DEEPSEEK_API_KEY 未配置')
  }

  return createHmac('sha256', secret).update(userId).digest('hex')
}
