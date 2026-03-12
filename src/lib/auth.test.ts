import { describe, expect, it } from 'vitest'
import {
  clearCurrentSession,
  createSession,
  getCurrentSession,
  getRegisteredUsers,
  getRemainingSessionMs,
  normalizeEmail,
  registerStoredUser,
  restoreAuthenticatedUser,
  saveCurrentSession,
  saveRegisteredUsers,
} from './auth'

describe('auth storage utilities', () => {
  it('normalizes email addresses before comparison', () => {
    expect(normalizeEmail('  Alex@Example.COM ')).toBe('alex@example.com')
  })

  it('stores a registered user and blocks duplicate emails', () => {
    const firstResult = registerStoredUser({
      email: 'Alex@Example.com',
      name: 'Alex Morgan',
      password: 'secret123',
    })

    expect(firstResult.success).toBe(true)
    expect(getRegisteredUsers()).toHaveLength(1)
    expect(getRegisteredUsers()[0]?.email).toBe('alex@example.com')

    const secondResult = registerStoredUser({
      email: 'alex@example.com',
      name: 'Another Alex',
      password: 'secret123',
    })

    expect(secondResult).toEqual({
      success: false,
      message: 'An account with this email already exists.',
    })
  })

  it('creates and tracks a five-minute session', () => {
    const session = createSession('user-1', 1_000)

    expect(session).toEqual({
      expiresAt: 301_000,
      userId: 'user-1',
    })
    expect(getRemainingSessionMs(session, 1_000)).toBe(300_000)
    expect(getRemainingSessionMs(session, 301_000)).toBe(0)
  })

  it('clears expired sessions during restore', () => {
    saveRegisteredUsers([
      {
        id: 'user-1',
        name: 'Alex Morgan',
        email: 'alex@example.com',
        password: 'secret123',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    ])
    saveCurrentSession({
      userId: 'user-1',
      expiresAt: Date.now() - 1_000,
    })

    expect(restoreAuthenticatedUser()).toBeNull()
    expect(getCurrentSession()).toBeNull()

    clearCurrentSession()
    expect(getCurrentSession()).toBeNull()
  })
})
