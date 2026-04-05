import { EmptyState } from '../../../components/empty-state'
import { ErrorState } from '../../../components/error-state'
import { LoadingGrid } from '../../../components/loading-grid'
import { ProductCard } from '../../../components/product-card'
import type { Product } from '../../../types'

interface ProductsResultsProps {
  error: string | null
  isLoading: boolean
  onAddToCart: (product: Product) => void
  onRetry: () => void
  products: Product[]
}

export function ProductsResults({
  error,
  isLoading,
  onAddToCart,
  onRetry,
  products,
}: ProductsResultsProps) {
  if (isLoading) {
    return <LoadingGrid />
  }

  if (error) {
    return (
      <ErrorState
        description={error}
        onRetry={onRetry}
        title="Unable to load the catalog"
      />
    )
  }

  if (products.length === 0) {
    return (
      <EmptyState
        description="Try a different product title or category filter to surface more items."
        title="No products matched your filters"
      />
    )
  }

  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} onAddToCart={onAddToCart} product={product} />
      ))}
    </section>
  )
}
