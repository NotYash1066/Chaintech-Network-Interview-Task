export const APP_ROUTES = {
  root: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  products: '/dashboard/products',
  cart: '/dashboard/cart',
  profile: '/dashboard/profile',
} as const

export const STORAGE_KEYS = {
  users: 'ct_users_v1',
  session: 'ct_session_v1',
  cart: (userId: string) => `ct_cart_${userId}_v1`,
} as const

export const SESSION_DURATION_MS = 5 * 60 * 1000

// USD to INR reference rate captured on 2026-03-12.
export const USD_TO_INR_RATE = 92.21

export const PRODUCTS_API_URL = 'https://dummyjson.com/products?limit=0'
export const PRODUCT_CATEGORIES_API_URL =
  'https://dummyjson.com/products/categories'

export const DASHBOARD_NAV_ITEMS = [
  { label: 'Overview', href: APP_ROUTES.dashboard },
  { label: 'Products', href: APP_ROUTES.products },
  { label: 'Cart', href: APP_ROUTES.cart },
  { label: 'Profile', href: APP_ROUTES.profile },
] as const
