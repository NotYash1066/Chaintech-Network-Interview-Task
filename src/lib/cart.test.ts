import { describe, expect, it } from 'vitest'
import {
  addUniqueCartItem,
  calculateCartTotal,
  calculateItemCount,
  decreaseCartItemQuantity,
  increaseCartItemQuantity,
  removeCartItem,
} from './cart'
import { convertUsdToInr } from './utils'
import type { CartItem, Product } from '../types'

const sampleProduct: Product = {
  id: 101,
  title: 'Phone Case',
  price: convertUsdToInr(49),
  category: 'accessories',
  thumbnail: 'https://example.com/phone-case.jpg',
}

describe('cart helpers', () => {
  it('adds unique items and blocks duplicates', () => {
    const firstAdd = addUniqueCartItem([], sampleProduct)

    expect(firstAdd.added).toBe(true)
    expect(firstAdd.items).toHaveLength(1)

    const secondAdd = addUniqueCartItem(firstAdd.items, sampleProduct)

    expect(secondAdd.added).toBe(false)
    expect(secondAdd.items).toHaveLength(1)
  })

  it('updates quantities and removes items', () => {
    const baseItems: CartItem[] = [
      {
        productId: 101,
        title: 'Phone Case',
        price: convertUsdToInr(49),
        thumbnail: 'https://example.com/phone-case.jpg',
        quantity: 1,
        currencyCode: 'INR' as const,
      },
    ]

    const increased = increaseCartItemQuantity(baseItems, 101)
    const decreased = decreaseCartItemQuantity(increased, 101)
    const clamped = decreaseCartItemQuantity(decreased, 101)

    expect(increased[0]?.quantity).toBe(2)
    expect(decreased[0]?.quantity).toBe(1)
    expect(clamped[0]?.quantity).toBe(1)
    expect(removeCartItem(clamped, 101)).toHaveLength(0)
  })

  it('calculates cart counts and totals', () => {
    const items: CartItem[] = [
      {
        productId: 101,
        title: 'Phone Case',
        price: convertUsdToInr(49),
        thumbnail: 'https://example.com/phone-case.jpg',
        quantity: 2,
        currencyCode: 'INR' as const,
      },
      {
        productId: 202,
        title: 'Tea Kettle',
        price: convertUsdToInr(89),
        thumbnail: 'https://example.com/tea-kettle.jpg',
        quantity: 1,
        currencyCode: 'INR' as const,
      },
    ]

    expect(calculateItemCount(items)).toBe(3)
    expect(calculateCartTotal(items)).toBe(17243.27)
  })
})
