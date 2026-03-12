import type { LoginInput, ProfileUpdateInput, RegisterInput } from '../types'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateName(name: string) {
  if (!name.trim()) {
    return 'Name is required.'
  }

  return null
}

function validateEmail(email: string) {
  if (!email.trim()) {
    return 'Email is required.'
  }

  if (!EMAIL_PATTERN.test(email.trim())) {
    return 'Enter a valid email address.'
  }

  return null
}

function validatePassword(password: string) {
  if (!password) {
    return 'Password is required.'
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters.'
  }

  return null
}

export function validateRegisterInput(input: RegisterInput) {
  return (
    validateName(input.name) ??
    validateEmail(input.email) ??
    validatePassword(input.password)
  )
}

export function validateLoginInput(input: LoginInput) {
  return validateEmail(input.email) ?? validatePassword(input.password)
}

export function validateProfileInput(input: ProfileUpdateInput) {
  return (
    validateName(input.name) ??
    validateEmail(input.email) ??
    validatePassword(input.password)
  )
}
