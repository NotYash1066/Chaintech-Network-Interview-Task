import { useCallback, useEffect, useState } from 'react'
import { getErrorMessage } from '../../lib/utils'
import type { Product } from '../../types'
import { fetchProductCategories, fetchProducts } from './api'

interface ProductsState {
  categories: string[]
  error: string | null
  isLoading: boolean
  products: Product[]
}

const initialState: ProductsState = {
  categories: [],
  error: null,
  isLoading: true,
  products: [],
}

export function useProducts() {
  const [state, setState] = useState<ProductsState>(initialState)

  const loadProducts = useCallback(async () => {
    setState((currentState) => ({
      ...currentState,
      error: null,
      isLoading: true,
    }))

    try {
      const [products, categories] = await Promise.all([
        fetchProducts(),
        fetchProductCategories(),
      ])

      setState({
        categories,
        error: null,
        isLoading: false,
        products,
      })
    } catch (error) {
      setState({
        categories: [],
        error: getErrorMessage(
          error,
          'We could not load products. Check your connection and retry.',
        ),
        isLoading: false,
        products: [],
      })
    }
  }, [])

  useEffect(() => {
    let isSubscribed = true

    const loadInitialProducts = async () => {
      try {
        const [products, categories] = await Promise.all([
          fetchProducts(),
          fetchProductCategories(),
        ])

        if (!isSubscribed) {
          return
        }

        setState({
          categories,
          error: null,
          isLoading: false,
          products,
        })
      } catch (error) {
        if (!isSubscribed) {
          return
        }

        setState({
          categories: [],
          error: getErrorMessage(
            error,
            'We could not load products. Check your connection and retry.',
          ),
          isLoading: false,
          products: [],
        })
      }
    }

    void loadInitialProducts()

    return () => {
      isSubscribed = false
    }
  }, [])

  return {
    ...state,
    retry: loadProducts,
  }
}
