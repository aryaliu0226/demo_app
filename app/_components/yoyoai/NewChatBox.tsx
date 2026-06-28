/** @format */
'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Fetch, FetchError } from '@/app/_config/fetch.config'
import ChatBox from '@/app/_components/yoyoai/ChatBox'

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
      const data = await Fetch<{ sessionId: string }>('/api/chat/session', {
        method: 'POST',
        body: { message: text },
        signal: controller.signal,
      })

      setInput('')
      router.push(`/yoyoai/${data.sessionId}`)
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      setError(
        err instanceof FetchError ? err.message : '新建聊天失败，请稍后再试',
      )
    } finally {
      abortControllerRef.current = null
      setLoading(false)
    }
  }

  function stop() {
    abortControllerRef.current?.abort()
  }

  return (
    <ChatBox
      value={input}
      loading={loading}
      onChange={setInput}
      onSend={send}
      onStop={stop}
    />
  )
}
