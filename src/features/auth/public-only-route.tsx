import { Navigate, Outlet } from 'react-router-dom'
import { APP_ROUTES } from '../../lib/constants'
import { useAuth } from './use-auth'

export function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate replace to={APP_ROUTES.dashboard} />
  }

  return <Outlet />
}
