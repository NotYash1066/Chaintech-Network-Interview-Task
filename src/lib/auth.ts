import { SESSION_DURATION_MS, STORAGE_KEYS } from './constants'
import { readStorage, removeStorage, writeStorage } from './storage'
import type {
  ActionResult,
  LoginInput,
  ProfileUpdateInput,
  RegisteredUser,
  RegisterInput,
  SessionRecord,
} from '../types'

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function getRegisteredUsers() {
  return readStorage<RegisteredUser[]>(STORAGE_KEYS.users, [])
}

export function getUserById(userId: string) {
  return getRegisteredUsers().find((user) => user.id === userId) ?? null
}

export function saveRegisteredUsers(users: RegisteredUser[]) {
  writeStorage(STORAGE_KEYS.users, users)
}

export function getCurrentSession() {
  return readStorage<SessionRecord | null>(STORAGE_KEYS.session, null)
}

export function createSession(userId: string, now = Date.now()): SessionRecord {
  return {
    userId,
    expiresAt: now + SESSION_DURATION_MS,
  }
}

export function saveCurrentSession(session: SessionRecord) {
  writeStorage(STORAGE_KEYS.session, session)
}

export function clearCurrentSession() {
  removeStorage(STORAGE_KEYS.session)
}

export function isSessionExpired(
  session: SessionRecord | null,
  now = Date.now(),
) {
  return !session || session.expiresAt <= now
}

export function getRemainingSessionMs(
  session: SessionRecord | null,
  now = Date.now(),
) {
  if (!session) {
    return 0
  }

  return Math.max(session.expiresAt - now, 0)
}

export function restoreAuthenticatedUser(now = Date.now()) {
  const session = getCurrentSession()

  if (!session || isSessionExpired(session, now)) {
    clearCurrentSession()
    return null
  }

  const user = getUserById(session.userId)

  if (!user) {
    clearCurrentSession()
    return null
  }

  return user
}

export function registerStoredUser(
  input: RegisterInput,
): ActionResult<RegisteredUser> {
  const normalizedEmail = normalizeEmail(input.email)
  const existingUser = getRegisteredUsers().find(
    (user) => user.email === normalizedEmail,
  )

  if (existingUser) {
    return {
      success: false,
      message: 'An account with this email already exists.',
    }
  }

  const timestamp = new Date().toISOString()
  const user: RegisteredUser = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email: normalizedEmail,
    password: input.password,
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  saveRegisteredUsers([...getRegisteredUsers(), user])

  return {
    success: true,
    data: user,
  }
}

export function authenticateUser(
  input: LoginInput,
): ActionResult<RegisteredUser> {
  const normalizedEmail = normalizeEmail(input.email)
  const user = getRegisteredUsers().find(
    (entry) =>
      entry.email === normalizedEmail && entry.password === input.password,
  )

  if (!user) {
    return {
      success: false,
      message: 'Invalid email or password.',
    }
  }

  return {
    success: true,
    data: user,
  }
}

export function updateStoredUser(
  userId: string,
  input: ProfileUpdateInput,
): ActionResult<RegisteredUser> {
  const users = getRegisteredUsers()
  const normalizedEmail = normalizeEmail(input.email)
  const duplicateUser = users.find(
    (user) => user.email === normalizedEmail && user.id !== userId,
  )

  if (duplicateUser) {
    return {
      success: false,
      message: 'That email is already in use by another account.',
    }
  }

  const currentUser = users.find((user) => user.id === userId)

  if (!currentUser) {
    return {
      success: false,
      message: 'Unable to find the current user.',
    }
  }

  const updatedUser: RegisteredUser = {
    ...currentUser,
    name: input.name.trim(),
    email: normalizedEmail,
    password: input.password,
    updatedAt: new Date().toISOString(),
  }

  saveRegisteredUsers(
    users.map((user) => (user.id === userId ? updatedUser : user)),
  )

  return {
    success: true,
    data: updatedUser,
  }
}
