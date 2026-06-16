/** @format */
'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import ChatBox from '@/ui/yoyoai/ChatBox'

export default function NewChatBox() {
  const router = useRouter()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const abortControllerRef = useRef<AbortController | null>(null)

  async function send() {
    const text = input.trim()
    if (!text || loading) return

    setError('')
    setLoading(true)

    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      const res = await fetch('/api/chat/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({ message: text }),
      })

      const data = (await res.json()) as { sessionId?: string; error?: string }

      if (!res.ok) {
        setError(data.error ?? '新建聊天失败，请稍后再试')
        return
      }

      setInput('')
      router.push(`/yoyoai/${data.sessionId}`)
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      setError(err instanceof Error ? err.message : '新建聊天失败，请稍后再试')
    } finally {
      abortControllerRef.current = null
      setLoading(false)
    }
  }

  function stop() {
    abortControllerRef.current?.abort()
  }

  return (
    <div>
      <ChatBox
        value={input}
        loading={loading}
        onChange={setInput}
        onSend={send}
        onStop={stop}
      />
      {error && (
        <p className='mx-auto -mt-2 max-w-2xl px-8 text-xs text-destructive'>
          {error}
        </p>
      )}
    </div>
  )
}
