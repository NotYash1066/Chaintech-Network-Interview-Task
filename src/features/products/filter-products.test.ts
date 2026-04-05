import { describe, expect, it } from 'vitest'
import type { Product } from '../../types'
import { filterProducts } from './filter-products'

const phoneCase: Product = {
  id: 1,
  title: 'Phone Case',
  price: 49,
  category: 'accessories',
  thumbnail: 'https://example.com/phone-case.jpg',
  stock: 12,
}

const teaKettle: Product = {
  id: 2,
  title: 'Tea Kettle',
  price: 89,
  category: 'kitchen-accessories',
  thumbnail: 'https://example.com/tea-kettle.jpg',
  stock: 5,
}

const travelPhoneCharger: Product = {
  id: 3,
  title: 'Travel Phone Charger',
  price: 39,
  category: 'electronics',
  thumbnail: 'https://example.com/travel-phone-charger.jpg',
  stock: 8,
}

const sampleProducts: Product[] = [phoneCase, teaKettle, travelPhoneCharger]

describe('filterProducts', () => {
  it('returns all products for an empty search and all categories', () => {
    expect(
      filterProducts({
        products: sampleProducts,
        searchTerm: '',
        selectedCategory: 'all',
      }),
    ).toEqual(sampleProducts)
  })

  it('matches product titles case-insensitively', () => {
    expect(
      filterProducts({
        products: sampleProducts,
        searchTerm: 'pHoNe',
        selectedCategory: 'all',
      }),
    ).toEqual([phoneCase, travelPhoneCharger])
  })

  it('filters by category when no search term is provided', () => {
    expect(
      filterProducts({
        products: sampleProducts,
        searchTerm: '',
        selectedCategory: 'kitchen-accessories',
      }),
    ).toEqual([teaKettle])
  })

  it('combines search and category filters', () => {
    expect(
      filterProducts({
        products: sampleProducts,
        searchTerm: 'phone',
        selectedCategory: 'accessories',
      }),
    ).toEqual([phoneCase])
  })

  it('returns an empty array when nothing matches', () => {
    expect(
      filterProducts({
        products: sampleProducts,
        searchTerm: 'laptop',
        selectedCategory: 'electronics',
      }),
    ).toEqual([])
  })
})
