/** @format */

const navItems = ['w-24', 'w-28', 'w-20']
const tabs = ['w-10', 'w-14', 'w-12', 'w-16', 'w-12']
const cards = Array.from({ length: 8 })

export default function Loading() {
  return (
    <div className='flex h-screen w-screen overflow-hidden bg-background text-foreground'>
      <aside className='hidden h-full w-14 shrink-0 flex-col items-center px-2 py-6 md:flex lg:w-[260px] lg:items-stretch lg:px-4'>
        <div className='mb-8 flex items-center justify-center gap-2 px-2 lg:justify-start'>
          <div className='h-8 w-8 rounded-xl bg-foreground/90' />
          <div className='hidden h-9 w-36 rounded-md bg-muted lg:block' />
        </div>

        <nav className='flex w-full flex-1 flex-col gap-2'>
          {navItems.map((width, index) => (
            <div
              key={width}
              className={[
                'flex h-12 items-center justify-center gap-3 rounded-lg px-3 lg:h-10 lg:justify-start',
                index === 0 ? 'bg-secondary' : '',
              ].join(' ')}>
              <div className='h-7 w-7 rounded-md bg-muted lg:h-6 lg:w-6' />
              <div className={`hidden h-4 rounded-full bg-muted lg:block ${width}`} />
            </div>
          ))}
        </nav>

        <div className='flex items-center justify-center gap-3 rounded-lg px-2 py-2 lg:justify-start'>
          <div className='h-8 w-8 shrink-0 rounded-full bg-muted' />
          <div className='hidden min-w-0 flex-1 space-y-2 lg:block'>
            <div className='h-3 w-24 rounded-full bg-muted' />
            <div className='h-3 w-16 rounded-full bg-muted' />
          </div>
        </div>
      </aside>

      <main className='min-h-full flex-1 overflow-y-auto px-4 pb-10 md:px-6'>
        <header className='sticky top-0 z-10 flex h-16 items-center justify-between gap-4 bg-background/95 backdrop-blur'>
          <div className='min-w-0 flex-1'>
            <div className='h-8 w-full max-w-[460px] rounded bg-hover' />
          </div>
          <div className='hidden h-9 w-28 rounded bg-primary/15 sm:block' />
        </header>

        <section className='animate-pulse'>
          <div className='sticky top-16 z-10 flex min-w-full gap-4 overflow-hidden bg-background pb-3 pt-1'>
            {tabs.map((width, index) => (
              <div
                key={`${width}-${index}`}
                className={`h-7 shrink-0 rounded-full bg-muted ${width}`}
              />
            ))}
          </div>

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
            {cards.map((_, index) => (
              <article
                key={index}
                className='overflow-hidden rounded-lg border border-border bg-background shadow-sm'>
                <div className='aspect-[16/9] bg-muted' />
                <div className='p-5'>
                  <div className='space-y-2'>
                    <div className='h-5 w-4/5 rounded bg-muted' />
                    <div className='h-5 w-3/5 rounded bg-muted' />
                  </div>
                  <div className='mt-5 flex items-center justify-between gap-4'>
                    <div className='flex min-w-0 items-center gap-2'>
                      <div className='h-8 w-8 shrink-0 rounded-full bg-muted' />
                      <div className='h-4 w-24 rounded bg-muted' />
                    </div>
                    <div className='flex shrink-0 items-center gap-1.5'>
                      <div className='h-5 w-5 rounded-full bg-muted' />
                      <div className='h-4 w-7 rounded bg-muted' />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
