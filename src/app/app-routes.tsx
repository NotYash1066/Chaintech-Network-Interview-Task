import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '../features/auth/protected-route'
import { PublicOnlyRoute } from '../features/auth/public-only-route'
import { useAuth } from '../features/auth/use-auth'
import { AuthLayout } from '../layouts/auth-layout'
import { DashboardLayout } from '../layouts/dashboard-layout'
import { APP_ROUTES } from '../lib/constants'
import { CartPage } from '../pages/cart-page'
import { DashboardHomePage } from '../pages/dashboard-home-page'
import { LoginPage } from '../pages/login-page'
import { ProductsPage } from '../pages/products-page'
import { ProfilePage } from '../pages/profile-page'
import { RegisterPage } from '../pages/register-page'

function RootRedirect() {
  const { isAuthenticated } = useAuth()

  return (
    <Navigate
      replace
      to={isAuthenticated ? APP_ROUTES.dashboard : APP_ROUTES.login}
    />
  )
}

function RouteFallback() {
  const { isAuthenticated } = useAuth()

  return (
    <Navigate
      replace
      to={isAuthenticated ? APP_ROUTES.dashboard : APP_ROUTES.login}
    />
  )
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<RootRedirect />} path={APP_ROUTES.root} />

      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route element={<LoginPage />} path={APP_ROUTES.login} />
          <Route element={<RegisterPage />} path={APP_ROUTES.register} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />} path={APP_ROUTES.dashboard}>
          <Route element={<DashboardHomePage />} index />
          <Route element={<ProductsPage />} path="products" />
          <Route element={<CartPage />} path="cart" />
          <Route element={<ProfilePage />} path="profile" />
        </Route>
      </Route>

      <Route element={<RouteFallback />} path="*" />
    </Routes>
  )
}
