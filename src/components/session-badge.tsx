import { formatCountdown } from '../lib/utils'

interface SessionBadgeProps {
  remainingMs: number
}

export function SessionBadge({ remainingMs }: SessionBadgeProps) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-accent-200 bg-accent-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent-700">
      <span className="h-2 w-2 rounded-full bg-accent-500" />
      Session {formatCountdown(remainingMs)}
    </div>
  )
}
