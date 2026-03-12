import type { PropsWithChildren } from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '../features/auth/auth-context'
import { useAuth } from '../features/auth/use-auth'
import { CartProvider } from '../features/cart/cart-context'

function CartProviderWithSession({ children }: PropsWithChildren) {
  const { user } = useAuth()

  return (
    <CartProvider key={user?.id ?? 'guest'} userId={user?.id ?? null}>
      {children}
    </CartProvider>
  )
}

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <CartProviderWithSession>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            className: '!rounded-[22px] !bg-slate-900 !px-4 !py-3 !text-sm !text-white !shadow-panel',
            duration: 2500,
          }}
        />
      </CartProviderWithSession>
    </AuthProvider>
  )
}
