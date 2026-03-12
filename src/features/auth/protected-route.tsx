import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { APP_ROUTES } from '../../lib/constants'
import { useAuth } from './use-auth'

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <Navigate
        replace
        state={{ from: location.pathname }}
        to={APP_ROUTES.login}
      />
    )
  }

  return <Outlet />
}
