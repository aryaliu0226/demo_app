/** @format */
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  ClipboardDocumentIcon,
  ArrowPathIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'
import { createTextDecoder } from '@/lib/text-codec'
import ChatBox from '@/ui/yoyoai/ChatBox'
import MarkdownMessage from '@/ui/yoyoai/MarkdownMessage'

type Role = 'user' | 'assistant'
type Message = { role: Role; content: string }

type ChatMessageProps = {
  sessionId: string
  initialMessages: Message[]
}

export default function ChatMessage({
  sessionId,
  initialMessages,
}: ChatMessageProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const autoStartedRef = useRef(false)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  /* ── 核心发送（history 直接传入，方便重试复用）────────────── */
  const sendWithHistory = useCallback(
    async (history: Message[]) => {
      const controller = new AbortController()
      abortControllerRef.current = controller
      setLoading(true)
      setMessages([...history, { role: 'assistant', content: '' }])

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({ sessionId, messages: history }),
        })

        if (!res.ok) {
          const { error } = (await res.json()) as { error: string }
          throw new Error(error)
        }
        if (!res.body) throw new Error('请求失败')
        const reader = res.body.getReader()
        const decoder = createTextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value)

          setMessages(prev => {
            const updated = [...prev]
            updated[updated.length - 1] = {
              role: 'assistant',
              content: updated[updated.length - 1].content + chunk,
            }
            return updated
          })
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return

        const msg = err instanceof Error ? err.message : '出错了，请稍后再试'
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            role: 'assistant',
            content: `⚠️ ${msg}`,
          }
          return updated
        })
        console.error(err)
      } finally {
        abortControllerRef.current = null
        setLoading(false)
      }
    },
    [sessionId],
  )

  useEffect(() => {
    if (autoStartedRef.current) return

    const lastMessage = initialMessages[initialMessages.length - 1]
    if (lastMessage?.role !== 'user') return

    autoStartedRef.current = true
    sendWithHistory(initialMessages)
  }, [initialMessages, sendWithHistory])

  /* ── 发送新消息 ─────────────────────────────────────────── */
  async function send() {
    const text = input.trim()
    if (!text || loading) return
    const history: Message[] = [...messages, { role: 'user', content: text }]
    setInput('')
    await sendWithHistory(history)
  }

  function stopGenerating() {
    abortControllerRef.current?.abort()
  }

  /* ── 重试：找到该 assistant 消息之前的最后一条 user 消息 ── */
  async function retry(assistantIdx: number) {
    if (loading) return
    // 取 assistant 消息之前的所有消息（不含当前 assistant）
    const history = messages.slice(0, assistantIdx)

    // 最后必须是 user 消息才能重试
    if (history.length === 0 || history[history.length - 1].role !== 'user')
      return
    await sendWithHistory(history)
  }

  /* ── 复制 ───────────────────────────────────────────────── */
  async function copy(content: string, idx: number) {
    await navigator.clipboard.writeText(content)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 1500)
  }

  return (
    <div className='flex h-full flex-col overflow-y-scroll'>
      {/* ── 消息列表 ─────────────────────────────────────── */}
      <div className='flex-1 px-4 py-10'>
        {messages.length === 0 && (
          <div className='flex h-full pt-30 flex-col items-center justify-center gap-3 text-muted-foreground'>
            <span className='text-5xl'>🐾</span>
            <p className='text-sm'>有什么关于宠物的问题，尽管问 YoYo～</p>
          </div>
        )}

        <div className='mx-auto flex max-w-2xl flex-col gap-4'>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`group flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className='flex max-w-[100%] flex-col gap-1'>
                <div
                  className={[
                    'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-foreground text-background rounded-br-sm whitespace-pre-wrap'
                      : 'bg-secondary text-foreground rounded-bl-sm',
                  ].join(' ')}>
                  {msg.role === 'assistant' ? (
                    <MarkdownMessage content={msg.content} />
                  ) : (
                    msg.content
                  )}
                  {loading &&
                    i === messages.length - 1 &&
                    msg.role === 'assistant' && (
                      <span className='ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-muted-foreground' />
                    )}
                </div>

                {/* ── 操作按钮（hover 显示）──────────────── */}
                {!(loading && i === messages.length - 1) && msg.content && (
                  <div
                    className={[
                      'flex gap-1 opacity-0 transition-opacity group-hover:opacity-100',
                      msg.role === 'user' ? 'justify-end' : 'justify-start',
                    ].join(' ')}>
                    {/* 复制 */}
                    <button
                      onClick={() => copy(msg.content, i)}
                      className='flex items-center  rounded px-2 py-1 text-xs text-muted-foreground transition hover:bg-hover hover:text-foreground'>
                      {copiedIdx === i ? (
                        <CheckIcon
                          className='h-4 w-4'
                          strokeWidth={2.6}
                        />
                      ) : (
                        <ClipboardDocumentIcon
                          className='h-4 w-4'
                          strokeWidth={2}
                        />
                      )}
                    </button>

                    {/* 重试（仅 assistant 消息） */}
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => retry(i)}
                        disabled={loading}
                        className='flex items-center  rounded px-2 py-1 text-xs text-muted-foreground transition hover:bg-hover hover:text-foreground disabled:opacity-30'>
                        <ArrowPathIcon
                          className='h-4 w-4'
                          strokeWidth={2}
                        />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      <ChatBox
        value={input}
        loading={loading}
        onChange={setInput}
        onSend={send}
        onStop={stopGenerating}
      />
    </div>
  )
}
