type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const title = slug
    .split("-")
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center px-6 py-16">
      <p className="text-sm font-medium text-zinc-500">/blog/[slug]</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950">
        {title || "Untitled Post"}
      </h1>
      <p className="mt-6 text-lg leading-8 text-zinc-600">
        This dynamic route receives the current post identifier from params.slug. The current
        slug is <span className="font-mono">{slug}</span>.
      </p>
    </main>
  );
}
