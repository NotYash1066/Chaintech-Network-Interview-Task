import { Button } from './button'
import { formatCategoryLabel, formatCurrency } from '../lib/utils'
import type { Product } from '../types'

interface ProductCardProps {
  onAddToCart: (product: Product) => void
  product: Product
}

export function ProductCard({ onAddToCart, product }: ProductCardProps) {
  return (
    <article className="group rounded-[28px] border border-white/80 bg-white/85 p-4 shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-panel">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-100 to-white">
        <img
          alt={product.title}
          className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          src={product.thumbnail}
        />
      </div>
      <div className="mt-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-700">
          {formatCategoryLabel(product.category)}
        </p>
        <div>
          <h3 className="line-clamp-2 text-lg font-semibold text-slate-900">
            {product.title}
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Stock {product.stock ?? 'available'}
          </p>
        </div>
        <div className="flex items-center justify-between gap-4 pt-2">
          <p className="text-xl font-semibold text-slate-900">
            {formatCurrency(product.price)}
          </p>
          <Button onClick={() => onAddToCart(product)} size="sm">
            Add to Cart
          </Button>
        </div>
      </div>
    </article>
  )
}
