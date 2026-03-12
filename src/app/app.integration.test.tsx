import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SESSION_DURATION_MS, STORAGE_KEYS } from '../lib/constants'
import { convertUsdToInr } from '../lib/utils'
import type { Product, RegisteredUser } from '../types'
import { renderApp } from '../test/test-utils'

const primaryUser: RegisteredUser = {
  id: 'user-1',
  name: 'Alex Morgan',
  email: 'alex@example.com',
  password: 'secret123',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

const secondaryUser: RegisteredUser = {
  id: 'user-2',
  name: 'Jordan Smith',
  email: 'jordan@example.com',
  password: 'secret123',
  createdAt: '2026-01-02T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
}

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Phone Case',
    price: 49,
    category: 'accessories',
    thumbnail: 'https://example.com/phone-case.jpg',
    stock: 12,
  },
  {
    id: 2,
    title: 'Tea Kettle',
    price: 89,
    category: 'kitchen-accessories',
    thumbnail: 'https://example.com/tea-kettle.jpg',
    stock: 5,
  },
]

function seedUsers(users: RegisteredUser[]) {
  window.localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users))
}

function seedSession(userId = primaryUser.id, expiresAt = Date.now() + SESSION_DURATION_MS) {
  window.localStorage.setItem(
    STORAGE_KEYS.session,
    JSON.stringify({
      userId,
      expiresAt,
    }),
  )
}

function seedAuthenticatedUser(user: RegisteredUser = primaryUser) {
  seedUsers([user])
  seedSession(user.id)
}

function mockCatalogRequests({
  fail = false,
}: {
  fail?: boolean
} = {}) {
  vi.spyOn(globalThis, 'fetch').mockImplementation(
    async (input: RequestInfo | URL) => {
      const url =
        typeof input === 'string'
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url

      if (fail) {
        return new Response(JSON.stringify({ message: 'failure' }), {
          status: 500,
        })
      }

      if (url.includes('/products/categories')) {
        return new Response(
          JSON.stringify(['accessories', 'kitchen-accessories']),
          { status: 200 },
        )
      }

      if (url.includes('/products?limit=0')) {
        return new Response(
          JSON.stringify({
            products: mockProducts,
            total: mockProducts.length,
            skip: 0,
            limit: 0,
          }),
          { status: 200 },
        )
      }

      return new Response(JSON.stringify({ message: 'not found' }), {
        status: 404,
      })
    },
  )
}

describe('app integration flows', () => {
  it('registers a user and redirects to login', async () => {
    const user = userEvent.setup()

    renderApp(['/register'])

    await user.type(screen.getByLabelText(/name/i), 'Alex Morgan')
    await user.type(screen.getByLabelText(/email/i), 'Alex@Example.com')
    await user.type(screen.getByLabelText(/password/i), 'secret123')
    await user.click(screen.getByRole('button', { name: /register/i }))

    await screen.findByRole('heading', { name: /access your dashboard/i })

    const storedUsers = JSON.parse(
      window.localStorage.getItem(STORAGE_KEYS.users) ?? '[]',
    ) as RegisteredUser[]

    expect(storedUsers).toHaveLength(1)
    expect(storedUsers[0]?.email).toBe('alex@example.com')
  })

  it('redirects unauthenticated users away from protected routes', async () => {
    renderApp(['/dashboard/products'])

    await screen.findByRole('heading', { name: /access your dashboard/i })
    expect(screen.queryByText(/explore the latest inventory/i)).not.toBeInTheDocument()
  })

  it('logs in successfully and restores a valid session on refresh', async () => {
    const user = userEvent.setup()
    seedUsers([primaryUser])

    const firstRender = renderApp(['/login'])

    await user.type(screen.getByLabelText(/email/i), primaryUser.email)
    await user.type(screen.getByLabelText(/password/i), primaryUser.password)
    await user.click(screen.getByRole('button', { name: /login/i }))

    await screen.findByText(/hi alex morgan/i)
    expect(window.localStorage.getItem(STORAGE_KEYS.session)).toBeTruthy()

    firstRender.unmount()

    renderApp(['/dashboard'])

    await screen.findByText(/hi alex morgan/i)
  })

  it('redirects expired sessions back to login', async () => {
    seedUsers([primaryUser])
    seedSession(primaryUser.id, Date.now() - 1_000)

    renderApp(['/dashboard'])

    await screen.findByRole('heading', { name: /access your dashboard/i })
  })

  it('loads products, filters them, and prevents duplicate cart items', async () => {
    const user = userEvent.setup()
    seedAuthenticatedUser()
    mockCatalogRequests()

    renderApp(['/dashboard/products'])

    await screen.findByText('Phone Case')
    expect(screen.getByText('Tea Kettle')).toBeInTheDocument()
    expect(screen.getByText('₹4,518.29')).toBeInTheDocument()

    await user.type(screen.getByLabelText(/search/i), 'Phone')

    await waitFor(() => {
      expect(screen.queryByText('Tea Kettle')).not.toBeInTheDocument()
    })

    const phoneCard = screen.getByText('Phone Case').closest('article')
    expect(phoneCard).not.toBeNull()

    await user.click(
      within(phoneCard as HTMLElement).getByRole('button', { name: /add to cart/i }),
    )
    await user.click(
      within(phoneCard as HTMLElement).getByRole('button', { name: /add to cart/i }),
    )

    await screen.findByText(/already in your cart/i)

    const storedCart = JSON.parse(
      window.localStorage.getItem(STORAGE_KEYS.cart(primaryUser.id)) ?? '[]',
    ) as Array<{ productId: number; price: number; currencyCode: string }>

    expect(storedCart).toHaveLength(1)
    expect(storedCart[0]?.productId).toBe(1)
    expect(storedCart[0]?.price).toBe(convertUsdToInr(49))
    expect(storedCart[0]?.currencyCode).toBe('INR')
  })

  it('handles product api failures gracefully', async () => {
    seedAuthenticatedUser()
    mockCatalogRequests({ fail: true })

    renderApp(['/dashboard/products'])

    await screen.findByText(/unable to load the catalog/i)
    expect(screen.getByRole('button', { name: /retry request/i })).toBeInTheDocument()
  })

  it('updates cart quantities and totals', async () => {
    const user = userEvent.setup()
    seedAuthenticatedUser()
    window.localStorage.setItem(
      STORAGE_KEYS.cart(primaryUser.id),
      JSON.stringify([
        {
          productId: 1,
          title: 'Phone Case',
          price: 49,
          thumbnail: 'https://example.com/phone-case.jpg',
          quantity: 1,
        },
      ]),
    )

    renderApp(['/dashboard/cart'])

    await screen.findByText('Phone Case')

    const incrementButton = screen.getByRole('button', { name: '+' })
    const decrementButton = screen.getByRole('button', { name: '-' })

    await user.click(incrementButton)
    expect(screen.getByText('₹9,036.58')).toBeInTheDocument()

    await user.click(decrementButton)
    expect(screen.getByText('₹4,518.29')).toBeInTheDocument()
  })

  it('updates the user profile and rejects duplicate emails', async () => {
    const user = userEvent.setup()
    seedUsers([primaryUser, secondaryUser])
    seedSession(primaryUser.id)

    renderApp(['/dashboard/profile'])

    await screen.findByDisplayValue(primaryUser.name)

    const nameInput = screen.getByLabelText(/^name$/i)
    const emailInput = screen.getByLabelText(/^email$/i)
    const passwordInput = screen.getByLabelText(/password/i)

    await user.clear(nameInput)
    await user.type(nameInput, 'Alex Rivers')
    await user.clear(emailInput)
    await user.type(emailInput, secondaryUser.email)
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    await screen.findAllByText(/already in use by another account/i)

    await user.clear(emailInput)
    await user.type(emailInput, 'alex.rivers@example.com')
    await user.clear(passwordInput)
    await user.type(passwordInput, 'updated123')
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    await screen.findByText(/profile updated successfully/i)
    await screen.findAllByText('Alex Rivers')

    const storedUsers = JSON.parse(
      window.localStorage.getItem(STORAGE_KEYS.users) ?? '[]',
    ) as RegisteredUser[]

    expect(storedUsers[0]?.name).toBe('Alex Rivers')
    expect(storedUsers[0]?.email).toBe('alex.rivers@example.com')
  })
})
