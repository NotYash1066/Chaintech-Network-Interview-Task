import { useState } from 'react'

interface AuthFormState {
  error: string | null
  isSubmitting: boolean
  finishSubmitting: () => void
  showError: (message: string) => void
  startSubmitting: () => void
}

export function useAuthFormState(): AuthFormState {
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const showError = (message: string) => {
    setError(message)
  }

  const startSubmitting = () => {
    setIsSubmitting(true)
    setError(null)
  }

  const finishSubmitting = () => {
    setIsSubmitting(false)
  }

  return {
    error,
    isSubmitting,
    finishSubmitting,
    showError,
    startSubmitting,
  }
}
