/** @format */
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  PaperAirplaneIcon,
  ClipboardDocumentIcon,
  ArrowPathIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'

type Role = 'user' | 'assistant'
type Message = { role: Role; content: string }

export default function YoYoChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function autoResize() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  /* ── 核心发送（history 直接传入，方便重试复用）────────────── */
  const sendWithHistory = useCallback(async (history: Message[]) => {
    setLoading(true)
    setMessages([...history, { role: 'assistant', content: '' }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })

      if (!res.ok) {
        const { error } = (await res.json()) as { error: string }
        throw new Error(error)
      }
      if (!res.body) throw new Error('请求失败')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

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
      const msg = err instanceof Error ? err.message : '出错了，请稍后再试'
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: 'assistant', content: `⚠️ ${msg}` }
        return updated
      })
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  /* ── 发送新消息 ─────────────────────────────────────────── */
  async function send() {
    const text = input.trim()
    if (!text || loading) return
    const history: Message[] = [...messages, { role: 'user', content: text }]
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    await sendWithHistory(history)
  }

  /* ── 重试：找到该 assistant 消息之前的最后一条 user 消息 ── */
  async function retry(assistantIdx: number) {
    if (loading) return
    // 取 assistant 消息之前的所有消息（不含当前 assistant）
    const history = messages.slice(0, assistantIdx).filter(
      (_, i, arr) => !(i === arr.length - 1 && arr[arr.length - 1].role === 'assistant'),
    )
    // 最后必须是 user 消息才能重试
    if (history.length === 0 || history[history.length - 1].role !== 'user') return
    await sendWithHistory(history)
  }

  /* ── 复制 ───────────────────────────────────────────────── */
  async function copy(content: string, idx: number) {
    await navigator.clipboard.writeText(content)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 1500)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className='flex h-full flex-col'>
      {/* ── 消息列表 ─────────────────────────────────────── */}
      <div className='flex-1 overflow-y-auto px-4 py-6 scrollbar-none'>
        {messages.length === 0 && (
          <div className='flex h-full flex-col items-center justify-center gap-3 text-muted-foreground'>
            <span className='text-5xl'>🐾</span>
            <p className='text-sm'>有什么关于宠物的问题，尽管问 YoYo～</p>
          </div>
        )}

        <div className='mx-auto flex max-w-2xl flex-col gap-4'>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`group flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <span className='mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-base'>
                  🐾
                </span>
              )}

              <div className='flex max-w-[75%] flex-col gap-1'>
                <div
                  className={[
                    'rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap',
                    msg.role === 'user'
                      ? 'bg-foreground text-background rounded-br-sm'
                      : 'bg-secondary text-foreground rounded-bl-sm',
                  ].join(' ')}>
                  {msg.content}
                  {loading && i === messages.length - 1 && msg.role === 'assistant' && (
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
                      className='flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground transition hover:bg-hover hover:text-foreground'>
                      {copiedIdx === i ? (
                        <CheckIcon className='h-3.5 w-3.5 text-green-400' />
                      ) : (
                        <ClipboardDocumentIcon className='h-3.5 w-3.5' />
                      )}
                      {copiedIdx === i ? '已复制' : '复制'}
                    </button>

                    {/* 重试（仅 assistant 消息） */}
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => retry(i)}
                        disabled={loading}
                        className='flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground transition hover:bg-hover hover:text-foreground disabled:opacity-30'>
                        <ArrowPathIcon className='h-3.5 w-3.5' />
                        重试
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

      {/* ── 输入区 ───────────────────────────────────────── */}
      <div className='border-t border-border px-4 py-3'>
        <div className='mx-auto flex max-w-2xl items-end gap-2 rounded-2xl bg-secondary px-4 py-2'>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => {
              setInput(e.target.value)
              autoResize()
            }}
            onKeyDown={handleKeyDown}
            placeholder='问问 YoYo…（Enter 发送，Shift+Enter 换行）'
            rows={1}
            className='flex-1 resize-none bg-transparent py-1.5 text-sm text-foreground placeholder:text-muted-foreground outline-none'
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className='mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-foreground text-background transition hover:opacity-80 disabled:opacity-30'>
            <PaperAirplaneIcon className='h-4 w-4' />
          </button>
        </div>
        <p className='mt-1.5 text-center text-xs text-muted-foreground'>
          YoYo 由 DeepSeek 驱动，回答仅供参考
        </p>
      </div>
    </div>
  )
}
