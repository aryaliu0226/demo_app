import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-medium text-zinc-500">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Page not found</h1>
      <Link href="/" className="mt-6 text-sm font-medium text-zinc-950 underline">
        Back home
      </Link>
    </main>
  );
}
