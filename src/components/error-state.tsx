import { Button } from './button'

interface ErrorStateProps {
  description: string
  onRetry?: () => void
  title: string
}

export function ErrorState({
  description,
  onRetry,
  title,
}: ErrorStateProps) {
  return (
    <div className="rounded-[32px] border border-rose-200 bg-rose-50/80 px-6 py-10 text-center shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
        Request failed
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-rose-900">{title}</h2>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-rose-700">
        {description}
      </p>
      {onRetry ? (
        <div className="mt-6 flex justify-center">
          <Button onClick={onRetry} variant="danger">
            Retry request
          </Button>
        </div>
      ) : null}
    </div>
  )
}
