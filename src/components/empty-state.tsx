import type { ReactNode } from 'react'

interface EmptyStateProps {
  action?: ReactNode
  description: string
  title: string
}

export function EmptyState({
  action,
  description,
  title,
}: EmptyStateProps) {
  return (
    <div className="rounded-[32px] border border-dashed border-slate-300 bg-white/80 px-6 py-14 text-center shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
        Nothing here yet
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-500">
        {description}
      </p>
      {action ? <div className="mt-8 flex justify-center">{action}</div> : null}
    </div>
  )
}
