import type { Product } from '../../types'

interface FilterProductsOptions {
  products: Product[]
  searchTerm: string
  selectedCategory: string
}

export function filterProducts({
  products,
  searchTerm,
  selectedCategory,
}: FilterProductsOptions) {
  const normalizedSearch = searchTerm.trim().toLowerCase()

  return products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch =
      normalizedSearch.length === 0 ||
      product.title.toLowerCase().includes(normalizedSearch)

    return matchesCategory && matchesSearch
  })
}
