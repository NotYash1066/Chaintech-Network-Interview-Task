import { STORAGE_KEYS } from './constants'
import { readStorage, removeStorage, writeStorage } from './storage'
import { convertUsdToInr } from './utils'
import type { CartItem, Product } from '../types'

type StoredCartItem = Omit<CartItem, 'currencyCode'> & {
  currencyCode?: CartItem['currencyCode']
}

export function getCartItems(userId: string) {
  const storedItems = readStorage<StoredCartItem[]>(STORAGE_KEYS.cart(userId), [])
  const hasLegacyItems = storedItems.some((item) => item.currencyCode !== 'INR')
  const normalizedItems: CartItem[] = storedItems.map((item) => ({
    ...item,
    currencyCode: 'INR' as const,
    price:
      item.currencyCode === 'INR' ? item.price : convertUsdToInr(item.price),
  }))

  if (hasLegacyItems) {
    saveCartItems(userId, normalizedItems)
  }

  return normalizedItems
}

export function saveCartItems(userId: string, items: CartItem[]) {
  writeStorage(STORAGE_KEYS.cart(userId), items)
}

export function clearCartItems(userId: string) {
  removeStorage(STORAGE_KEYS.cart(userId))
}

export function addUniqueCartItem(items: CartItem[], product: Product) {
  if (items.some((item) => item.productId === product.id)) {
    return {
      items,
      added: false,
    }
  }

  return {
    items: [
      ...items,
      {
        productId: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        quantity: 1,
        currencyCode: 'INR' as const,
      },
    ],
    added: true,
  }
}

export function increaseCartItemQuantity(items: CartItem[], productId: number) {
  return items.map((item) =>
    item.productId === productId
      ? { ...item, quantity: item.quantity + 1 }
      : item,
  )
}

export function decreaseCartItemQuantity(items: CartItem[], productId: number) {
  return items.map((item) =>
    item.productId === productId
      ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
      : item,
  )
}

export function removeCartItem(items: CartItem[], productId: number) {
  return items.filter((item) => item.productId !== productId)
}

export function calculateItemSubtotal(item: CartItem) {
  return item.price * item.quantity
}

export function calculateCartTotal(items: CartItem[]) {
  return items.reduce((total, item) => total + calculateItemSubtotal(item), 0)
}

export function calculateItemCount(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0)
}
