import { Link } from 'react-router-dom'
import { Button } from '../../../components/button'
import { APP_ROUTES } from '../../../lib/constants'
import { formatCurrency } from '../../../lib/utils'

interface CartOrderSummaryProps {
  cartTotal: number
  itemCount: number
  totalProducts: number
}

export function CartOrderSummary({
  cartTotal,
  itemCount,
  totalProducts,
}: CartOrderSummaryProps) {
  return (
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
          <span className="font-semibold text-slate-900">{totalProducts}</span>
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
  )
}
