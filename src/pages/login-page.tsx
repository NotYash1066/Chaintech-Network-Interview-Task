import { useState, type FormEvent } from 'react'
import toast from 'react-hot-toast'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/button'
import { InputField } from '../components/input-field'
import { AuthFormErrorBanner } from '../features/auth/components/auth-form-error-banner'
import { useAuthFormState } from '../features/auth/hooks/use-auth-form-state'
import { useAuth } from '../features/auth/use-auth'
import { APP_ROUTES } from '../lib/constants'
import { validateLoginInput } from '../lib/validation'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { error, finishSubmitting, isSubmitting, showError, startSubmitting } =
    useAuthFormState()

  const from = location.state?.from ?? APP_ROUTES.dashboard

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationError = validateLoginInput({ email, password })

    if (validationError) {
      showError(validationError)
      return
    }

    startSubmitting()

    const result = login({ email, password })

    finishSubmitting()

    if (!result.success) {
      showError(result.message)
      toast.error(result.message)
      return
    }

    toast.success('Welcome back.')
    navigate(from, { replace: true })
  }

  return (
    <div className="rounded-[32px] border border-white/80 bg-white/90 p-6 shadow-panel sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.34em] text-accent-700">
        Login
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
        Access your dashboard
      </h1>
      <p className="mt-3 text-sm leading-7 text-slate-500">
        Sign in to unlock the product catalog, cart controls, and profile
        editor.
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <InputField
          autoComplete="email"
          label="Email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          type="email"
          value={email}
        />
        <InputField
          autoComplete="current-password"
          label="Password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          type="password"
          value={password}
        />
        <AuthFormErrorBanner message={error} />
        <Button fullWidth type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Login'}
        </Button>
      </form>

      <p className="mt-6 text-sm text-slate-500">
        New here?{' '}
        <Link className="font-semibold text-accent-700" to={APP_ROUTES.register}>
          Create an account
        </Link>
      </p>
    </div>
  )
}
