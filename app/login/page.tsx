/** @format */

import AuthForm from '@/ui/login/AuthForm'
import PhoneIcon from '@/Icon/PhoneIcon'
import ChatIcon from '@/Icon/ChatIcon'

export default function SigninPage() {
  return (
    <section className='w-full max-w-sm'>
      {/* 卡片 */}
      <div className='rounded-2xl border border-zinc-200/60 bg-white/80 p-7 shadow-xl shadow-zinc-900/5 backdrop-blur'>
        <AuthForm />

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
            <PhoneIcon />
          </button>
          <button
            type='button'
            disabled
            title='即将上线'
            className='flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-zinc-300'>
            <ChatIcon />
          </button>
        </div>
      </div>

      {/* 注册引导 */}
      <p className='mt-6 text-center text-sm text-zinc-500'>
        新用户可直接登录，系统会自动创建账号哦~
      </p>
    </section>
  )
}
