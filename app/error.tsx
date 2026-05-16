"use client";

import { useEffect } from "react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-medium text-zinc-500">Error boundary</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Something went wrong</h1>
      <button
        type="button"
        onClick={() => unstable_retry()}
        className="mt-6 rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
      >
        Try again
      </button>
    </main>
  );
}
