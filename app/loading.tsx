export default function Loading() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6">
      <div className="w-full max-w-xl space-y-4">
        <div className="h-6 w-40 animate-pulse rounded bg-zinc-200" />
        <div className="h-10 w-full animate-pulse rounded bg-zinc-200" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-200" />
      </div>
    </main>
  );
}
