import { useState, type FormEvent } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/button'
import { InputField } from '../components/input-field'
import { AuthFormErrorBanner } from '../features/auth/components/auth-form-error-banner'
import { useAuthFormState } from '../features/auth/hooks/use-auth-form-state'
import { useAuth } from '../features/auth/use-auth'
import { APP_ROUTES } from '../lib/constants'
import { validateRegisterInput } from '../lib/validation'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { error, finishSubmitting, isSubmitting, showError, startSubmitting } =
    useAuthFormState()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationError = validateRegisterInput({ email, name, password })

    if (validationError) {
      showError(validationError)
      return
    }

    startSubmitting()

    const result = register({ email, name, password })

    finishSubmitting()

    if (!result.success) {
      showError(result.message)
      toast.error(result.message)
      return
    }

    toast.success('Registration complete. Log in to continue.')
    navigate(APP_ROUTES.login)
  }

  return (
    <div className="rounded-[32px] border border-white/80 bg-white/90 p-6 shadow-panel sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.34em] text-accent-700">
        Register
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
        Create your account
      </h1>
      <p className="mt-3 text-sm leading-7 text-slate-500">
        Set up your sign-in details, then continue into the protected
        dashboard experience.
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <InputField
          autoComplete="name"
          label="Name"
          onChange={(event) => setName(event.target.value)}
          placeholder="Alex Morgan"
          value={name}
        />
        <InputField
          autoComplete="email"
          label="Email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="alex@example.com"
          type="email"
          value={email}
        />
        <InputField
          autoComplete="new-password"
          helperText="Use at least 6 characters."
          label="Password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Create a password"
          type="password"
          value={password}
        />
        <AuthFormErrorBanner message={error} />
        <Button fullWidth type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Register'}
        </Button>
      </form>

      <p className="mt-6 text-sm text-slate-500">
        Already registered?{' '}
        <Link className="font-semibold text-accent-700" to={APP_ROUTES.login}>
          Sign in instead
        </Link>
      </p>
    </div>
  )
}
