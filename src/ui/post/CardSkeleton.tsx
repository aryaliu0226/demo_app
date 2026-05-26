/** @format */

export default function CardSkeleton() {
  return (
    <article className='overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm'>
      <div className='aspect-[16/9] animate-pulse bg-zinc-200' />

      <div className='p-5'>
        <div className='mt-3 space-y-2'>
          <div className='h-5 w-4/5 animate-pulse rounded bg-zinc-200' />
          <div className='h-5 w-3/5 animate-pulse rounded bg-zinc-200' />
        </div>

        <div className='mt-5 flex items-center justify-between gap-4'>
          <div className='flex min-w-0 items-center gap-2'>
            <div className='h-8 w-8 shrink-0 animate-pulse rounded-full bg-zinc-200' />
            <div className='h-4 w-24 animate-pulse rounded bg-zinc-200' />
          </div>

          <div className='flex shrink-0 items-center gap-1'>
            <div className='h-6 w-6 animate-pulse rounded-full bg-zinc-200' />
            <div className='h-4 w-8 animate-pulse rounded bg-zinc-200' />
          </div>
        </div>
      </div>
    </article>
  )
}
