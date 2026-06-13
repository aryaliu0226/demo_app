/** @format */
'use client'

import { useRef, useState } from 'react'
import { PaperAirplaneIcon, StopIcon } from '@heroicons/react/24/outline'

type NewChatBoxProps = {}

export default function NewChatBox({}: NewChatBoxProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')

  function autoResize() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
    autoResize()
  }

  function handleButtonClick() {
    if (loading) {
      return
    }

    onSend()
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  function onSend() {}

  return (
    <div className='mx-auto my-10 px-4 pb-4 pt-3 flex items-end w-full max-w-2xl  gap-2 rounded-2xl border border-border bg-background px-4 py-2 shadow-[0_12px_40px_rgba(26,26,26,0.14)]'>
      <textarea
        ref={textareaRef}
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder='问问 YoYo…（Enter 发送，Shift+Enter 换行）'
        rows={1}
        className='min-h-8 leading-8 flex-1 resize-none bg-transparent  text-base text-foreground placeholder:text-muted-foreground outline-none'
      />
      <button
        onClick={handleButtonClick}
        disabled={!loading && !input.trim()}
        className=' flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-foreground text-background transition hover:opacity-80 disabled:opacity-30'>
        {loading ? (
          <StopIcon className='h-4 w-4' />
        ) : (
          <PaperAirplaneIcon className='h-4 w-4' />
        )}
      </button>
    </div>
  )
}
