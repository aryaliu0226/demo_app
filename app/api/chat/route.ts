/** @format */

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { deepseek, deepseekModel } from '@/lib/ai/deepseek'
import { getOptionalUserId } from '@/lib/auth'
import { encodeText } from '@/lib/text-codec'

const MAX_MESSAGES = 20
const MAX_MESSAGE_LENGTH = 2000

const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z
          .string()
          .trim()
          .min(1, '消息不能为空')
          .max(
            MAX_MESSAGE_LENGTH,
            `单条消息不能超过 ${MAX_MESSAGE_LENGTH} 个字符`,
          ),
      }),
    )
    .min(1, '请先输入消息')
    .max(MAX_MESSAGES, `最多只能携带 ${MAX_MESSAGES} 条上下文消息`),
})

type ChatMessages = z.infer<typeof chatRequestSchema>['messages']
type ParseChatRequestResult =
  | { success: false; error: string }
  | { success: true; messages: ChatMessages }

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

async function parseChatRequest(
  req: NextRequest,
): Promise<ParseChatRequestResult> {
  try {
    const body = await req.json()
    const parsed = chatRequestSchema.safeParse(body)

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? '请求参数有误',
      }
    }

    return { success: true, messages: parsed.data.messages }
  } catch {
    return { success: false, error: '请求体必须是合法的 JSON' }
  }
}

export async function POST(req: NextRequest) {
  const userId = await getOptionalUserId()

  if (!userId) {
    return Response.json({ error: '请先登录后再使用 YoYo' }, { status: 401 })
  }

  const parsed = await parseChatRequest(req)

  if (!parsed.success) {
    return Response.json({ error: parsed.error }, { status: 400 })
  }

  const messages = parsed.messages

  try {
    const stream = await deepseek.chat.completions.create({
      model: deepseekModel,
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

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? ''
          if (text) controller.enqueue(encodeText(text))
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
