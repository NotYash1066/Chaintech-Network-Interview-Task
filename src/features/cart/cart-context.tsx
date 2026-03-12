import {
  useCallback,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import toast from 'react-hot-toast'
import {
  addUniqueCartItem,
  calculateCartTotal,
  calculateItemCount,
  clearCartItems,
  decreaseCartItemQuantity,
  getCartItems,
  increaseCartItemQuantity,
  removeCartItem,
  saveCartItems,
} from '../../lib/cart'
import { CartContext } from './cart-context-store'
import type { CartItem, Product } from '../../types'

interface CartProviderProps extends PropsWithChildren {
  userId: string | null
}

export function CartProvider({ children, userId }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>(() =>
    userId ? getCartItems(userId) : [],
  )

  const persistItems = useCallback(
    (nextItems: CartItem[]) => {
      setItems(nextItems)

      if (userId) {
        saveCartItems(userId, nextItems)
      }
    },
    [userId],
  )

  const addItem = useCallback(
    (product: Product) => {
      if (!userId) {
        toast.error('Log in to manage your cart.')
        return false
      }

      const result = addUniqueCartItem(items, product)

      if (!result.added) {
        toast.error('That item is already in your cart.')
        return false
      }

      persistItems(result.items)
      toast.success('Product added to cart.')
      return true
    },
    [items, persistItems, userId],
  )

  const increaseQty = useCallback(
    (productId: number) => {
      persistItems(increaseCartItemQuantity(items, productId))
    },
    [items, persistItems],
  )

  const decreaseQty = useCallback(
    (productId: number) => {
      persistItems(decreaseCartItemQuantity(items, productId))
    },
    [items, persistItems],
  )

  const removeItem = useCallback(
    (productId: number) => {
      persistItems(removeCartItem(items, productId))
      toast.success('Item removed from your cart.')
    },
    [items, persistItems],
  )

  const clearCart = useCallback(() => {
    if (!userId) {
      return
    }

    clearCartItems(userId)
    setItems([])
  }, [userId])

  const itemCount = useMemo(() => calculateItemCount(items), [items])
  const cartTotal = useMemo(() => calculateCartTotal(items), [items])

  const value = useMemo(
    () => ({
      addItem,
      cartTotal,
      clearCart,
      decreaseQty,
      increaseQty,
      itemCount,
      items,
      removeItem,
    }),
    [
      addItem,
      cartTotal,
      clearCart,
      decreaseQty,
      increaseQty,
      itemCount,
      items,
      removeItem,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
