import { startTransition, useDeferredValue, useMemo, useState } from 'react'
import { ProductCard } from '../components/product-card'
import { EmptyState } from '../components/empty-state'
import { ErrorState } from '../components/error-state'
import { LoadingGrid } from '../components/loading-grid'
import { useCart } from '../features/cart/use-cart'
import { useProducts } from '../features/products/use-products'
import { useDebouncedValue } from '../lib/use-debounced-value'
import { formatCategoryLabel } from '../lib/utils'

export function ProductsPage() {
  const { addItem } = useCart()
  const { categories, error, isLoading, products, retry } = useProducts()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const debouncedSearch = useDebouncedValue(searchTerm, 250)
  const deferredSearch = useDeferredValue(debouncedSearch)

  const filteredProducts = useMemo(() => {
    const normalizedSearch = deferredSearch.trim().toLowerCase()

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory
      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.title.toLowerCase().includes(normalizedSearch)

      return matchesCategory && matchesSearch
    })
  }, [deferredSearch, products, selectedCategory])

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/80 bg-white/90 p-6 shadow-soft">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Product catalog
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              Explore the latest inventory
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              Search products instantly, filter by category, and add unique
              items to your cart from a responsive grid.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,320px)_200px]">
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Search
              <input
                className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-accent-500 focus:ring-2 focus:ring-accent-100"
                onChange={(event) =>
                  startTransition(() => setSearchTerm(event.target.value))
                }
                placeholder="Search by product title"
                value={searchTerm}
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Category
              <select
                className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-accent-500 focus:ring-2 focus:ring-accent-100"
                onChange={(event) =>
                  startTransition(() => setSelectedCategory(event.target.value))
                }
                value={selectedCategory}
              >
                <option value="all">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {formatCategoryLabel(category)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition ${
              selectedCategory === 'all'
                ? 'bg-ink text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-accent-200 hover:text-accent-700'
            }`}
            onClick={() => setSelectedCategory('all')}
            type="button"
          >
            All
          </button>
          {categories.map((category) => (
            <button
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition ${
                selectedCategory === category
                  ? 'bg-ink text-white'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-accent-200 hover:text-accent-700'
              }`}
              key={category}
              onClick={() => setSelectedCategory(category)}
              type="button"
            >
              {formatCategoryLabel(category)}
            </button>
          ))}
        </div>
      </section>

      {isLoading ? <LoadingGrid /> : null}

      {!isLoading && error ? (
        <ErrorState
          description={error}
          onRetry={() => {
            void retry()
          }}
          title="Unable to load the catalog"
        />
      ) : null}

      {!isLoading && !error && filteredProducts.length === 0 ? (
        <EmptyState
          description="Try a different product title or category filter to surface more items."
          title="No products matched your filters"
        />
      ) : null}

      {!isLoading && !error && filteredProducts.length > 0 ? (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} onAddToCart={addItem} product={product} />
          ))}
        </section>
      ) : null}
    </div>
  )
}
