export interface RegisteredUser {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
  updatedAt: string
}

export interface SessionRecord {
  userId: string
  expiresAt: number
}

export interface AuthState {
  user: RegisteredUser | null
  isAuthenticated: boolean
  remainingMs: number
}

export interface Product {
  id: number
  title: string
  price: number
  category: string
  thumbnail: string
  images?: string[]
  stock?: number
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export interface CartItem {
  productId: number
  title: string
  price: number
  thumbnail: string
  quantity: number
  currencyCode: 'INR'
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface ProfileUpdateInput {
  name: string
  email: string
  password: string
}

export interface ActionSuccess<T = undefined> {
  success: true
  data?: T
}

export interface ActionFailure {
  success: false
  message: string
}

export type ActionResult<T = undefined> = ActionSuccess<T> | ActionFailure

export interface AuthContextValue extends AuthState {
  register: (input: RegisterInput) => ActionResult<RegisteredUser>
  login: (input: LoginInput) => ActionResult<RegisteredUser>
  logout: (message?: string) => void
  updateProfile: (input: ProfileUpdateInput) => ActionResult<RegisteredUser>
}

export interface CartContextValue {
  items: CartItem[]
  itemCount: number
  cartTotal: number
  addItem: (product: Product) => boolean
  increaseQty: (productId: number) => void
  decreaseQty: (productId: number) => void
  removeItem: (productId: number) => void
  clearCart: () => void
}

export type RawCategory =
  | string
  | {
      slug?: string
      name?: string
      url?: string
    }
