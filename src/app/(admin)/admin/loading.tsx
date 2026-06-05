export default function AdminLoading() {
  return (
    <div className="space-y-6 p-4 md:p-8 pt-6">
      <div className="h-9 w-64 bg-muted animate-pulse rounded-xl" />
      <div className="h-4 w-96 bg-muted animate-pulse rounded" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-36 rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-72 rounded-2xl bg-muted animate-pulse" />
        <div className="h-72 rounded-2xl bg-muted animate-pulse" />
      </div>
    </div>
  )
}
