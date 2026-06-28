/** @format */
'use client'

import { useRef } from 'react'
import { PaperAirplaneIcon, StopIcon } from '@heroicons/react/24/outline'
import { PlusIcon } from '../icon/Icons'

type ChatBoxProps = {
  value: string
  loading: boolean
  onChange: (value: string) => void
  onSend: () => void
  onStop: () => void
}

export default function ChatBox({
  value,
  loading,
  onChange,
  onSend,
  onStop,
}: ChatBoxProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
    onChange(e.target.value)
    autoResize()
  }

  function handleButtonClick() {
    if (loading) {
      onStop()
      return
    }

    onSend()
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  return (
    <div className='sticky bottom-6'>
      <div className='max-w-2xl mx-auto px-4 pb-4 pt-3 border border-border  rounded-xl bg-background px-4 py-2 shadow-[0_12px_40px_rgba(26,26,26,0.14)]'>
        <div className=' w-full'>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder='问问 YoYo…（Enter 发送，Shift+Enter 换行）'
            rows={1}
            className='w-full min-h-12 resize-none bg-transparent py-1.5 text-md text-foreground placeholder:text-muted-foreground outline-none'
          />
        </div>

        <div className='w-full flex justify-between  gap-2 rounded-2xl '>
          <button>
            <PlusIcon />
          </button>
          <button
            onClick={handleButtonClick}
            disabled={!loading && !value.trim()}
            className='flex h-8 w-8 shrink-0 items-center rounded-xl justify-center bg-foreground text-background transition hover:opacity-80 disabled:opacity-30'>
            {loading ? (
              <StopIcon className='h-4 w-4' />
            ) : (
              <PaperAirplaneIcon className='h-4 w-4' />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
