/** @format */

import OpenAI from 'openai'

// export const deepseekModel = 'deepseek-chat'
export const deepseekModel = 'deepseek-v4-pro'

export const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
})
