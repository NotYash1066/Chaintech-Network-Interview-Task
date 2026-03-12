import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import { cn } from '../lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'md' | 'sm'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

const baseClasses =
  'inline-flex items-center justify-center rounded-full font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-ink text-white shadow-soft hover:bg-slate-800 focus:ring-slate-800',
  secondary:
    'border border-slate-200 bg-white text-slate-700 hover:border-accent-200 hover:text-accent-700',
  ghost: 'bg-transparent text-slate-600 hover:bg-white/70 hover:text-slate-900',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500',
}

const sizeClasses: Record<ButtonSize, string> = {
  md: 'h-11 px-5 text-sm',
  sm: 'h-9 px-4 text-xs uppercase tracking-[0.24em]',
}

export function Button({
  children,
  className,
  fullWidth = false,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}
