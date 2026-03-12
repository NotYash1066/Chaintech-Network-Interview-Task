interface LoadingGridProps {
  count?: number
}

export function LoadingGrid({ count = 8 }: LoadingGridProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          className="animate-pulse rounded-[28px] border border-white/80 bg-white/80 p-4 shadow-soft"
          key={index}
        >
          <div className="aspect-[4/3] rounded-3xl bg-slate-200" />
          <div className="mt-4 h-4 rounded-full bg-slate-200" />
          <div className="mt-2 h-4 w-2/3 rounded-full bg-slate-100" />
          <div className="mt-6 h-11 rounded-full bg-slate-200" />
        </div>
      ))}
    </div>
  )
}
