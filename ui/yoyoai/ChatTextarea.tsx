/** @format */

'use client'
export default function ChatTextarea() {
  return (
    <div className='sticky bottom-0 px-4 pb-4 pt-3'>
      <div className='mx-auto flex w-full max-w-2xl items-end gap-2 rounded-2xl border border-border bg-background px-4 py-2 shadow-[0_12px_40px_rgba(26,26,26,0.14)]'>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder='问问 YoYo…（Enter 发送，Shift+Enter 换行）'
          rows={1}
          className='flex-1 resize-none bg-transparent py-1.5 text-sm text-foreground placeholder:text-muted-foreground outline-none'
        />
        <button
          onClick={handleButtonClick}
          disabled={!loading && !value.trim()}
          className='mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-foreground text-background transition hover:opacity-80 disabled:opacity-30'>
          {loading ? (
            <StopIcon className='h-4 w-4' />
          ) : (
            <PaperAirplaneIcon className='h-4 w-4' />
          )}
        </button>
      </div>
    </div>
  )
}
