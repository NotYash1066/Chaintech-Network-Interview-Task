import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { APP_ROUTES } from '../../lib/constants'
import { useAuth } from './use-auth'

export function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  const redirectTo =
    typeof location.state?.from === 'string'
      ? location.state.from
      : APP_ROUTES.dashboard

  if (isAuthenticated) {
    return <Navigate replace to={redirectTo} />
  }

  return <Outlet />
}
