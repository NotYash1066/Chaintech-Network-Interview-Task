import type { CartItem } from '../../../types'
import { CartItemRow } from './cart-item-row'

interface CartItemsListProps {
  items: CartItem[]
  decreaseQty: (productId: number) => void
  increaseQty: (productId: number) => void
  removeItem: (productId: number) => void
}

export function CartItemsList({
  items,
  decreaseQty,
  increaseQty,
  removeItem,
}: CartItemsListProps) {
  return (
    <section className="space-y-4">
      {items.map((item) => (
        <CartItemRow
          decreaseQty={decreaseQty}
          increaseQty={increaseQty}
          item={item}
          key={item.productId}
          removeItem={removeItem}
        />
      ))}
    </section>
  )
}
