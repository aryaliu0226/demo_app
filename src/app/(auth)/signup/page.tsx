/** @format */

'use client'
import { useActionState } from 'react'
import { signup } from '@/lib/auth'
import Link from 'next/link'

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(signup, null)

  return (
    <section className=' w-full max-w-sm'>
      {/* 卡片 */}
      <div className='rounded-2xl border border-zinc-200/60 bg-white/80 p-7 shadow-xl shadow-zinc-900/5 backdrop-blur'>
        <form
          action={formAction}
          className='space-y-4'>
          <div className='space-y-1.5'>
            <label
              htmlFor='account'
              className='block text-sm font-medium text-zinc-700'>
              账号
            </label>
            <input
              id='account'
              name='account'
              placeholder='请输入账号'
              className='w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10'
            />
          </div>

          <div className='space-y-1.5'>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-zinc-700'>
              密码
            </label>
            <input
              id='password'
              name='password'
              type='password'
              placeholder='请输入密码'
              className='w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10'
            />
          </div>

          {/* 错误提示 */}
          {state?.error && (
            <div className='flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='15'
                height='15'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='shrink-0'>
                <circle
                  cx='12'
                  cy='12'
                  r='10'
                />
                <line
                  x1='12'
                  y1='8'
                  x2='12'
                  y2='12'
                />
                <line
                  x1='12'
                  y1='16'
                  x2='12.01'
                  y2='16'
                />
              </svg>
              {state.error}
            </div>
          )}

          <button
            disabled={pending}
            className='mt-2 w-full rounded-xl bg-zinc-900 py-2.5 text-sm font-medium text-white transition-all hover:bg-zinc-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60'>
            {pending ? '注册中…' : '注册'}
          </button>
        </form>

        {/* 分隔线（为后续第三方/验证码登录预留） */}
        <div className='my-5 flex items-center gap-3 text-xs text-zinc-400'>
          <span className='h-px flex-1 bg-zinc-200' />
          其他方式登录
          <span className='h-px flex-1 bg-zinc-200' />
        </div>

        <div className='flex justify-center gap-3'>
          <button
            type='button'
            disabled
            title='即将上线'
            className='flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-zinc-300'>
            {/* 手机号 */}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='18'
              height='18'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'>
              <rect
                x='5'
                y='2'
                width='14'
                height='20'
                rx='2'
              />
              <line
                x1='12'
                y1='18'
                x2='12'
                y2='18'
              />
            </svg>
          </button>
          <button
            type='button'
            disabled
            title='即将上线'
            className='flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-zinc-300'>
            {/* 微信占位 */}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='18'
              height='18'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'>
              <path d='M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z' />
            </svg>
          </button>
        </div>
      </div>

      {/* 注册引导 */}
      <p className='mt-6 text-center text-sm text-zinc-500'>
        还没有账号？
        <Link
          href='/signup'
          className='font-medium text-zinc-900 hover:underline'>
          立即注册
        </Link>
      </p>
    </section>
  )
}
