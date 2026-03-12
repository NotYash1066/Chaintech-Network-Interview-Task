import {
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import toast from 'react-hot-toast'
import {
  authenticateUser,
  clearCurrentSession,
  createSession,
  getCurrentSession,
  getRemainingSessionMs,
  isSessionExpired,
  registerStoredUser,
  restoreAuthenticatedUser,
  saveCurrentSession,
  updateStoredUser,
} from '../../lib/auth'
import { AuthContext } from './auth-context-store'
import type {
  LoginInput,
  ProfileUpdateInput,
  RegisterInput,
  RegisteredUser,
} from '../../types'

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<RegisteredUser | null>(() =>
    restoreAuthenticatedUser(),
  )
  const [remainingMs, setRemainingMs] = useState(() =>
    getRemainingSessionMs(getCurrentSession()),
  )

  const handleSessionExpiry = useEffectEvent(() => {
    clearCurrentSession()
    setUser(null)
    setRemainingMs(0)
    toast.error('Your session expired. Log in again to keep shopping.')
  })

  useEffect(() => {
    if (!user) {
      return
    }

    const syncSession = () => {
      const session = getCurrentSession()
      const nextRemainingMs = getRemainingSessionMs(session)

      setRemainingMs(nextRemainingMs)

      if (isSessionExpired(session)) {
        handleSessionExpiry()
      }
    }

    const intervalId = window.setInterval(syncSession, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [user])

  const register = useCallback((input: RegisterInput) => {
    return registerStoredUser(input)
  }, [])

  const login = useCallback((input: LoginInput) => {
    const result = authenticateUser(input)

    if (!result.success || !result.data) {
      return result
    }

    const session = createSession(result.data.id)

    saveCurrentSession(session)
    setUser(result.data)
    setRemainingMs(getRemainingSessionMs(session))

    return result
  }, [])

  const logout = useCallback((message?: string) => {
    clearCurrentSession()
    setUser(null)
    setRemainingMs(0)

    if (message) {
      toast.success(message)
    }
  }, [])

  const updateProfile = useCallback((input: ProfileUpdateInput) => {
    if (!user) {
      return {
        success: false,
        message: 'You must be logged in to update your profile.',
      } as const
    }

    const result = updateStoredUser(user.id, input)

    if (result.success && result.data) {
      setUser(result.data)
    }

    return result
  }, [user])

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(user),
      login,
      logout,
      register,
      remainingMs,
      updateProfile,
      user,
    }),
    [login, logout, register, remainingMs, updateProfile, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
