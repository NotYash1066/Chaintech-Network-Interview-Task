interface StatCardProps {
  label: string
  value: string
  caption: string
}

export function StatCard({ caption, label, value }: StatCardProps) {
  return (
    <div className="rounded-[28px] border border-white/80 bg-white/85 p-5 shadow-soft backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
        {value}
      </p>
      <p className="mt-2 text-sm text-slate-500">{caption}</p>
    </div>
  )
}
