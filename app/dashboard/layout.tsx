import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="flex min-h-dvh flex-col bg-zinc-50 text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-sm font-semibold">
            Demo App
          </Link>
          <nav className="flex items-center gap-4 text-sm text-zinc-600">
            <Link href="/dashboard" className="hover:text-zinc-950">
              Dashboard
            </Link>
            <Link href="/blog/hello-nextjs" className="hover:text-zinc-950">
              Blog
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">{children}</main>
    </section>
  );
}
