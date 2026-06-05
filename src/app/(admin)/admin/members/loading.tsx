export default function MembersLoading() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="h-9 w-40 bg-muted animate-pulse rounded-xl" />
      <div className="h-4 w-80 bg-muted animate-pulse rounded" />
      <div className="flex justify-between gap-4 mt-6">
        <div className="h-10 w-80 bg-muted animate-pulse rounded-xl" />
        <div className="h-10 w-32 bg-muted animate-pulse rounded-xl" />
      </div>
      <div className="rounded-xl border border-border overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-border last:border-0">
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse shrink-0" />
            <div className="h-4 w-36 bg-muted animate-pulse rounded" />
            <div className="h-4 w-24 bg-muted animate-pulse rounded ml-auto" />
            <div className="h-4 w-28 bg-muted animate-pulse rounded" />
            <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
