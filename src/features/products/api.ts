import { convertUsdToInr } from '../../lib/utils'
import {
  PRODUCT_CATEGORIES_API_URL,
  PRODUCTS_API_URL,
} from '../../lib/constants'
import type { Product, ProductsResponse, RawCategory } from '../../types'

function normalizeCategory(category: RawCategory) {
  if (typeof category === 'string') {
    return category
  }

  return category.slug ?? category.name ?? ''
}

function normalizeProduct(product: Product) {
  return {
    ...product,
    price: convertUsdToInr(product.price),
  }
}

export async function fetchProducts() {
  const response = await fetch(PRODUCTS_API_URL)

  if (!response.ok) {
    throw new Error('Unable to load products right now.')
  }

  const data = (await response.json()) as ProductsResponse

  return data.products.map(normalizeProduct)
}

export async function fetchProductCategories() {
  const response = await fetch(PRODUCT_CATEGORIES_API_URL)

  if (!response.ok) {
    throw new Error('Unable to load categories right now.')
  }

  const data = (await response.json()) as RawCategory[]

  return data
    .map(normalizeCategory)
    .filter(Boolean)
    .sort((left, right) => left.localeCompare(right))
}
