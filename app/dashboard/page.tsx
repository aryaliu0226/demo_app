const stats = [
  { label: "Active users", value: "1,248" },
  { label: "Conversion", value: "8.7%" },
  { label: "Open tasks", value: "23" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-zinc-500">/dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Dashboard</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-zinc-200 bg-white p-5">
            <p className="text-sm text-zinc-500">{stat.label}</p>
            <p className="mt-3 text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
