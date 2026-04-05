import { startTransition, useDeferredValue, useMemo, useState } from 'react'
import { useCart } from '../features/cart/use-cart'
import { ProductsCategoryChips } from '../features/products/components/products-category-chips'
import { ProductsFilters } from '../features/products/components/products-filters'
import { ProductsResults } from '../features/products/components/products-results'
import { filterProducts } from '../features/products/filter-products'
import { useProducts } from '../features/products/use-products'
import { useDebouncedValue } from '../lib/use-debounced-value'

export function ProductsPage() {
  const { addItem } = useCart()
  const { categories, error, isLoading, products, retry } = useProducts()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const debouncedSearch = useDebouncedValue(searchTerm, 250)
  const deferredSearch = useDeferredValue(debouncedSearch)

  const filteredProducts = useMemo(() => {
    return filterProducts({
      products,
      searchTerm: deferredSearch,
      selectedCategory,
    })
  }, [deferredSearch, products, selectedCategory])

  const handleSearchChange = (nextSearchTerm: string) => {
    startTransition(() => setSearchTerm(nextSearchTerm))
  }

  const handleCategoryChange = (nextCategory: string) => {
    startTransition(() => setSelectedCategory(nextCategory))
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
  }

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

          <ProductsFilters
            categories={categories}
            onCategoryChange={handleCategoryChange}
            onSearchChange={handleSearchChange}
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
          />
        </div>

        <ProductsCategoryChips
          categories={categories}
          onSelectCategory={handleCategorySelect}
          selectedCategory={selectedCategory}
        />
      </section>

      <ProductsResults
        error={error}
        isLoading={isLoading}
        onAddToCart={addItem}
        onRetry={() => {
          void retry()
        }}
        products={filteredProducts}
      />
    </div>
  )
}
