import { useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/button'
import { SessionBadge } from '../components/session-badge'
import { DASHBOARD_NAV_ITEMS, APP_ROUTES } from '../lib/constants'
import { cn } from '../lib/utils'
import { useAuth } from '../features/auth/use-auth'
import { useCart } from '../features/cart/use-cart'

const PAGE_TITLES: Record<string, string> = {
  [APP_ROUTES.dashboard]: 'Overview',
  [APP_ROUTES.products]: 'Products',
  [APP_ROUTES.cart]: 'Cart',
  [APP_ROUTES.profile]: 'Profile',
}

function Sidebar({
  closeMobileMenu,
}: {
  closeMobileMenu?: () => void
}) {
  const { itemCount } = useCart()
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-100">
            Chaintech Store
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">
            Welcome back, {user?.name.split(' ')[0]}
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-300">
            Keep your dashboard locked, your cart tidy, and your product flow
            responsive.
          </p>
        </div>

        <nav className="mt-8 space-y-2">
          {DASHBOARD_NAV_ITEMS.map((item) => (
            <NavLink
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between rounded-full px-4 py-3 text-sm font-medium transition',
                  isActive
                    ? 'bg-white text-slate-900 shadow-soft'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white',
                )
              }
              key={item.href}
              onClick={closeMobileMenu}
              to={item.href}
            >
              <span>{item.label}</span>
              {item.href === APP_ROUTES.cart ? (
                <span className="rounded-full border border-slate-200/30 px-2 py-1 text-[10px] uppercase tracking-[0.28em]">
                  {itemCount}
                </span>
              ) : null}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="space-y-3">
        <Link
          className="flex min-w-0 items-center gap-3 rounded-[28px] border border-white/10 bg-white/5 p-4 text-sm text-slate-200 transition hover:bg-white/10"
          to={APP_ROUTES.profile}
        >
          <span className="min-w-0 flex-1 truncate">{user?.email}</span>
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-xs font-semibold uppercase tracking-[0.18em] text-accent-100">
            P
          </span>
        </Link>
        <Button
          className="w-full bg-white/10 text-white hover:bg-white/20"
          onClick={() => {
            logout('Signed out successfully.')
            navigate(APP_ROUTES.login)
          }}
          variant="ghost"
        >
          Logout
        </Button>
      </div>
    </div>
  )
}

export function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const { remainingMs, user } = useAuth()

  const pageTitle = useMemo(
    () => PAGE_TITLES[pathname] ?? 'Dashboard',
    [pathname],
  )

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="hidden border-r border-white/60 bg-ink px-6 py-8 lg:block">
        <Sidebar />
      </aside>

      <div
        className={cn(
          'fixed inset-0 z-40 bg-slate-950/45 transition lg:hidden',
          isMobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-80 bg-ink px-6 py-8 transition duration-200 lg:hidden',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <Sidebar closeMobileMenu={() => setIsMobileMenuOpen(false)} />
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-white/70 bg-canvas/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-soft lg:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
                type="button"
              >
                <span className="text-lg leading-none">≡</span>
              </button>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Dashboard
                </p>
                <h1 className="truncate text-2xl font-semibold tracking-tight text-slate-900">
                  {pageTitle}
                </h1>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-3">
              <SessionBadge remainingMs={remainingMs} />
              <div className="hidden rounded-full border border-white/70 bg-white px-4 py-3 shadow-soft sm:block">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                  Active user
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {user?.name}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
