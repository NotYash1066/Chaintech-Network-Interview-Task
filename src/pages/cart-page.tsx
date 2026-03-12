import { Link } from 'react-router-dom'
import { Button } from '../components/button'
import { EmptyState } from '../components/empty-state'
import { useCart } from '../features/cart/use-cart'
import { calculateItemSubtotal } from '../lib/cart'
import { APP_ROUTES } from '../lib/constants'
import { formatCurrency } from '../lib/utils'

export function CartPage() {
  const { cartTotal, decreaseQty, increaseQty, itemCount, items, removeItem } =
    useCart()

  if (items.length === 0) {
    return (
      <EmptyState
        action={
          <Link to={APP_ROUTES.products}>
            <Button>Browse products</Button>
          </Link>
        }
        description="Your cart is empty. Add products from the catalog to start building an order."
        title="No items in your cart"
      />
    )
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-4">
        {items.map((item) => (
          <article
            className="grid gap-4 rounded-[32px] border border-white/80 bg-white/90 p-5 shadow-soft sm:grid-cols-[110px_minmax(0,1fr)_auto]"
            key={item.productId}
          >
            <img
              alt={item.title}
              className="aspect-square w-full rounded-3xl bg-slate-100 object-cover"
              src={item.thumbnail}
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                Cart item
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                {item.title}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {formatCurrency(item.price)} each
              </p>
              <p className="mt-5 text-sm font-medium text-slate-700">
                Subtotal {formatCurrency(calculateItemSubtotal(item))}
              </p>
            </div>

            <div className="flex flex-col items-start justify-between gap-4 sm:items-end">
              <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
                <button
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-700 transition hover:border-accent-200 hover:text-accent-700"
                  onClick={() => decreaseQty(item.productId)}
                  type="button"
                >
                  -
                </button>
                <span className="min-w-8 text-center text-sm font-semibold text-slate-900">
                  {item.quantity}
                </span>
                <button
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-700 transition hover:border-accent-200 hover:text-accent-700"
                  onClick={() => increaseQty(item.productId)}
                  type="button"
                >
                  +
                </button>
              </div>

              <Button
                className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                onClick={() => removeItem(item.productId)}
                variant="ghost"
              >
                Remove item
              </Button>
            </div>
          </article>
        ))}
      </section>

      <aside className="h-fit rounded-[32px] border border-white/80 bg-white/90 p-6 shadow-soft xl:sticky xl:top-28">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Order summary
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
          Review your cart
        </h2>
        <div className="mt-8 space-y-4 rounded-[28px] bg-slate-50 p-5">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Total items</span>
            <span className="font-semibold text-slate-900">{itemCount}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Distinct products</span>
            <span className="font-semibold text-slate-900">{items.length}</span>
          </div>
          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Cart total</span>
              <span className="text-2xl font-semibold text-slate-900">
                {formatCurrency(cartTotal)}
              </span>
            </div>
          </div>
        </div>
        <Link className="mt-6 inline-flex w-full" to={APP_ROUTES.products}>
          <Button className="w-full" variant="secondary">
            Continue shopping
          </Button>
        </Link>
      </aside>
    </div>
  )
}
