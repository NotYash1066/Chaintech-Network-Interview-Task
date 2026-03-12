import { Link } from 'react-router-dom'
import { Button } from '../components/button'
import { StatCard } from '../components/stat-card'
import { useAuth } from '../features/auth/use-auth'
import { useCart } from '../features/cart/use-cart'
import { APP_ROUTES } from '../lib/constants'
import { formatCountdown, formatCurrency } from '../lib/utils'

const quickLinks = [
  {
    href: APP_ROUTES.products,
    title: 'Browse products',
    description: 'Load the remote catalog, search live, and add items to the cart.',
  },
  {
    href: APP_ROUTES.cart,
    title: 'Manage cart',
    description: 'Review quantities, subtotals, and your full order value.',
  },
  {
    href: APP_ROUTES.profile,
    title: 'Edit profile',
    description: 'Update your name, email, and password in one place.',
  },
] as const

export function DashboardHomePage() {
  const { remainingMs, user } = useAuth()
  const { cartTotal, itemCount } = useCart()

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[36px] bg-ink px-6 py-8 text-white shadow-panel sm:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-accent-100">
            Welcome
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Hi {user?.name}, your commerce workspace is ready.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-300 sm:text-base">
            Your five-minute session is active. Use the protected navigation to
            explore products, build a cart, and update your profile without
            losing momentum.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={APP_ROUTES.products}>
              <Button>Start shopping</Button>
            </Link>
            <Link to={APP_ROUTES.profile}>
              <Button variant="ghost" className="bg-white/10 text-white hover:bg-white/20">
                Open profile
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <StatCard
          caption="Auto-logout keeps all protected screens private."
          label="Session"
          value={formatCountdown(remainingMs)}
        />
        <StatCard
          caption="Your saved cart stays ready for your next visit on this device."
          label="Cart items"
          value={`${itemCount}`}
        />
        <StatCard
          caption={user?.email ?? 'No active email'}
          label="Cart total"
          value={formatCurrency(cartTotal)}
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {quickLinks.map((link) => (
          <div
            className="rounded-[32px] border border-white/80 bg-white/90 p-6 shadow-soft"
            key={link.href}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Quick action
            </p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
              {link.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              {link.description}
            </p>
            <Link className="mt-8 inline-flex" to={link.href}>
              <Button variant="secondary">Open section</Button>
            </Link>
          </div>
        ))}
      </section>
    </div>
  )
}
