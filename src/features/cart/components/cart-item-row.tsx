import { Button } from '../../../components/button'
import { calculateItemSubtotal } from '../../../lib/cart'
import { formatCurrency } from '../../../lib/utils'
import type { CartItem } from '../../../types'

interface CartItemRowProps {
  item: CartItem
  decreaseQty: (productId: number) => void
  increaseQty: (productId: number) => void
  removeItem: (productId: number) => void
}

export function CartItemRow({
  item,
  decreaseQty,
  increaseQty,
  removeItem,
}: CartItemRowProps) {
  return (
    <article className="grid gap-4 rounded-[32px] border border-white/80 bg-white/90 p-5 shadow-soft sm:grid-cols-[110px_minmax(0,1fr)_auto]">
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
  )
}
