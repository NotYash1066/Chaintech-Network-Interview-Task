import { Link } from 'react-router-dom'
import { Button } from '../components/button'
import { EmptyState } from '../components/empty-state'
import { CartItemsList } from '../features/cart/components/cart-items-list'
import { CartOrderSummary } from '../features/cart/components/cart-order-summary'
import { useCart } from '../features/cart/use-cart'
import { APP_ROUTES } from '../lib/constants'

export function CartPage() {
  const { cartTotal, decreaseQty, increaseQty, itemCount, items, removeItem } =
    useCart()

  if (items.length === 0) {
    return (
      <EmptyState
        action={
          <Link to={APP_ROUTES.products}>
            <Button>Browse products</Button>
          </Link>
        }
        description="Your cart is empty. Add products from the catalog to start building an order."
        title="No items in your cart"
      />
    )
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <CartItemsList
        decreaseQty={decreaseQty}
        increaseQty={increaseQty}
        items={items}
        removeItem={removeItem}
      />

      <CartOrderSummary
        cartTotal={cartTotal}
        itemCount={itemCount}
        totalProducts={items.length}
      />
    </div>
  )
}
