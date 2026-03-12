import { Link, Outlet } from 'react-router-dom'
import { APP_ROUTES } from '../lib/constants'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-dashboard-glow">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1.15fr_0.85fr]">
        <section className="relative hidden overflow-hidden border-r border-white/70 bg-ink px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.45),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.32),transparent_30%)]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-accent-100">
              Chaintech Commerce
            </p>
            <h1 className="mt-6 max-w-xl text-5xl font-semibold leading-tight tracking-tight">
              Secure shopping starts with a protected workspace.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">
              Register, sign in, manage products, track your session, and keep
              your cart organized across every screen.
            </p>
          </div>
          <div className="relative grid gap-4 rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-100">
                Protected by design
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-200">
                Every dashboard route stays locked behind a five-minute active
                session.
              </p>
            </div>
            <div className="grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                Product search and category filtering
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                Per-user cart persistence with quantity controls
              </div>
            </div>
          </div>
        </section>

        <main className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">
                  Commerce Console
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Secure sign-in and protected dashboard access.
                </p>
              </div>
              <Link
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600 transition hover:border-accent-200 hover:text-accent-700"
                to={APP_ROUTES.login}
              >
                Sign in
              </Link>
            </div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
