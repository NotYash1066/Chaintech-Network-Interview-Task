import { useState, type FormEvent } from 'react'
import toast from 'react-hot-toast'
import { Button } from '../components/button'
import { InputField } from '../components/input-field'
import { AuthFormErrorBanner } from '../features/auth/components/auth-form-error-banner'
import { useAuthFormState } from '../features/auth/hooks/use-auth-form-state'
import { useAuth } from '../features/auth/use-auth'
import { validateProfileInput } from '../lib/validation'

function ProfileForm() {
  const { updateProfile, user } = useAuth()
  const [name, setName] = useState(() => user?.name ?? '')
  const [email, setEmail] = useState(() => user?.email ?? '')
  const [password, setPassword] = useState(() => user?.password ?? '')
  const { error, finishSubmitting, isSubmitting, showError, startSubmitting } =
    useAuthFormState()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationError = validateProfileInput({ email, name, password })

    if (validationError) {
      showError(validationError)
      return
    }

    startSubmitting()

    const result = updateProfile({ email, name, password })

    finishSubmitting()

    if (!result.success) {
      showError(result.message)
      toast.error(result.message)
      return
    }

    toast.success('Profile updated successfully.')
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      <InputField
        label="Name"
        onChange={(event) => setName(event.target.value)}
        value={name}
      />
      <InputField
        label="Email"
        onChange={(event) => setEmail(event.target.value)}
        type="email"
        value={email}
      />
      <InputField
        helperText="Use a password you can remember easily."
        label="Password"
        onChange={(event) => setPassword(event.target.value)}
        type="password"
        value={password}
      />
      <AuthFormErrorBanner message={error} />
      <Button disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Saving...' : 'Save changes'}
      </Button>
    </form>
  )
}

export function ProfilePage() {
  const { user } = useAuth()

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section className="rounded-[32px] border border-white/80 bg-white/90 p-6 shadow-soft sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Account details
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
          Edit your profile
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
          Update your account details and see changes reflected instantly across
          the dashboard.
        </p>

        <ProfileForm key={user?.updatedAt ?? user?.id ?? 'guest'} />
      </section>

      <aside className="space-y-5">
        <div className="rounded-[32px] border border-white/80 bg-white/90 p-6 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Profile summary
          </p>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
            {user?.name}
          </h3>
          <p className="mt-2 text-sm text-slate-500">{user?.email}</p>
        </div>
        <div className="rounded-[32px] border border-accent-100 bg-accent-50/80 p-6 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-700">
            Account access
          </p>
          <p className="mt-4 text-sm leading-7 text-accent-900">
            Keep your details current so your session, checkout flow, and
            account summary stay accurate everywhere.
          </p>
        </div>
      </aside>
    </div>
  )
}
