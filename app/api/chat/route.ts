/** @format */
'use server'
import { NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import {
  deepseek,
  deepseekModel,
  encodeDeepseekUserId,
} from '@/app/_lib/ai/deepseek'
import { getOptionalUserId } from '@/app/_lib/auth'
import {
  prismaSessionIsolation,
  prismaCreateChatMessage,
  prismaCreateUserChatMessageIfNeeded,
} from '@/app/_lib/dal/chat'
import { encodeText } from '@/app/_lib/text-codec'
import {
  isServerException,
  SERVER_ERROR_MESSAGE,
} from '@/app/_lib/prisma'

const MAX_MESSAGES = 20
const MAX_MESSAGE_LENGTH = 2000
const MAX_TOKEN = 500

const SYSTEM_PROMPT = `
你是 YoYo，一个专注于宠物话题的 AI 助手，
熟悉宠物饲养、健康、训练等知识，
回答简洁友好。`

const chatRequestSchema = z.object({
  sessionId: z.string().uuid('会话不存在'),
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
  | { success: true; sessionId: string; messages: ChatMessages }

/* ── DeepSeek 错误码 → 中文提示 ─────────────────────────── */
function friendlyError(status: number): string {
  const map: Record<number, string> = {
    400: '格式错误',
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

    return {
      success: true,
      sessionId: parsed.data.sessionId,
      messages: parsed.data.messages,
    }
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

  const { sessionId, messages } = parsed
  //会话隔离：校验sessionId是否属于此userId
  let isSessionMappingUser: boolean
  try {
    isSessionMappingUser = await prismaSessionIsolation(userId, sessionId)
  } catch (e) {
    if (isServerException(e)) {
      return Response.json({ error: SERVER_ERROR_MESSAGE }, { status: 500 })
    }
    throw e
  }

  if (!isSessionMappingUser) {
    return Response.json({ error: '会话不存在' }, { status: 404 })
  }

  const latestUserMessage = [...messages]
    .reverse()
    .find(message => message.role === 'user')

  if (!latestUserMessage) {
    return Response.json({ error: '请先输入消息' }, { status: 400 })
  }

  try {
    await prismaCreateUserChatMessageIfNeeded({
      sessionId,
      content: latestUserMessage.content,
    })
  } catch (e) {
    if (isServerException(e)) {
      return Response.json({ error: SERVER_ERROR_MESSAGE }, { status: 500 })
    }
    throw e
  }

  try {
    const deepseekUserId = encodeDeepseekUserId(userId)

    //     {
    //   "id": "930c60df-bf64-41c9-a88e-3ec75f81e00e",
    //   "choices": [
    //     {
    //       "finish_reason": "stop",
    //       "index": 0,
    //       "message": {
    //         "content": "Hello! How can I help you today?",
    //         "role": "assistant"
    //       }
    //     }
    //   ],
    //   "created": 1705651092,
    //   "model": "deepseek-v4-pro",
    //   "object": "chat.completion",
    //   "usage": {
    //     "completion_tokens": 10,
    //     "prompt_tokens": 16,
    //     "total_tokens": 26
    //   }
    // }
    const stream = await deepseek.chat.completions.create({
      model: deepseekModel,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        ...messages,
      ],
      user: deepseekUserId,
      stream: true,
      stream_options: {
        include_usage: true,
      },
      // max_token: MAX_TOKEN,
      tools: [],
    })
    console.log('stream-----', stream)

    const readable = new ReadableStream({
      async start(controller) {
        let assistantContent = ''

        try {
          for await (const chunk of stream) {
            console.log('chunk-----', chunk)

            const text = chunk.choices[0]?.delta?.content ?? ''
            if (!text) continue

            assistantContent += text
            controller.enqueue(encodeText(text))
          }
        } finally {
          if (assistantContent.trim()) {
            try {
              await prismaCreateChatMessage({
                sessionId,
                role: 'assistant',
                content: assistantContent,
              })
              revalidatePath('/yoyoai', 'layout')
            } catch (e) {
              if (!isServerException(e)) throw e
            }
          }

          controller.close()
        }
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
