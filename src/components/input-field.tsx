import type { InputHTMLAttributes } from 'react'
import { cn } from '../lib/utils'

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string | null
  helperText?: string
  label: string
}

export function InputField({
  className,
  error,
  helperText,
  id,
  label,
  ...props
}: InputFieldProps) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input
        aria-invalid={Boolean(error)}
        className={cn(
          'h-12 rounded-2xl border bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-accent-500 focus:ring-2 focus:ring-accent-100',
          error ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100' : 'border-slate-200',
          className,
        )}
        id={id}
        {...props}
      />
      {error ? (
        <span className="text-xs font-medium text-rose-600">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-slate-500">{helperText}</span>
      ) : null}
    </label>
  )
}
