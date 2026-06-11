/** @format */

import OpenAI from 'openai'
import { NextRequest } from 'next/server'
import { getOptionalUserId } from '@/lib/auth'

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
})

/* ── DeepSeek 错误码 → 中文提示 ─────────────────────────── */
function friendlyError(status: number): string {
  const map: Record<number, string> = {
    401: 'API Key 无效，请检查配置',
    402: 'DeepSeek 账户余额不足，请前往平台充值',
    422: '请求参数有误，请刷新后重试',
    429: '请求太频繁，请稍后再试',
    500: 'DeepSeek 服务异常，请稍后再试',
    503: 'DeepSeek 服务繁忙，请稍后再试',
  }
  return map[status] ?? `请求失败（${status}），请稍后再试`
}

export async function POST(req: NextRequest) {
  const userId = await getOptionalUserId()

  if (!userId) {
    return Response.json({ error: '请先登录后再使用 YoYo' }, { status: 401 })
  }

  const { messages } = (await req.json()) as {
    messages: OpenAI.Chat.ChatCompletionMessageParam[]
  }

  try {
    const stream = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content:
            '你是 YoYo，一个专注于宠物话题的 AI 助手，熟悉宠物饲养、健康、训练等知识，回答简洁友好。',
        },
        ...messages,
      ],
      stream: true,
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? ''
          if (text) controller.enqueue(encoder.encode(text))
        }
        controller.close()
      },
    })

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500
    const message = friendlyError(status)
    console.error('[chat]', status, message)
    return Response.json({ error: message }, { status })
  }
}
