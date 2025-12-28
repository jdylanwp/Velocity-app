export function TrendGridSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="flex gap-3">
          <div className="h-9 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="h-9 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <TrendCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function TrendCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 space-y-2">
          <div className="h-6 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="h-5 w-20 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="h-7 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
      </div>

      <div className="h-10 w-full bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse mb-4" />

      <div className="flex items-end justify-between mb-3">
        <div className="h-8 w-20 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
      </div>

      <div className="h-16 w-full bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
    </div>
  );
}
