import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { useProducts } from './ProductContext'

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { product, quantity } = action
      const existing = state.items.find(i => i.id === product.id)
      let newItems
      if (existing) {
        newItems = state.items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i)
      } else {
        newItems = [...state.items, { ...product, quantity }]
      }
      return { ...state, items: newItems }
    }
    case 'REMOVE': {
      return { ...state, items: state.items.filter(i => i.id !== action.id) }
    }
    case 'SET_QTY': {
      const { id, quantity } = action
      return { ...state, items: state.items.map(i => i.id === id ? { ...i, quantity } : i) }
    }
    case 'CLEAR': {
      return { ...state, items: [] }
    }
    case 'CHECKOUT': {
      return { ...state, items: [] }
    }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })
  const { products, decrementProductStock } = useProducts()

  useEffect(() => {
    try {
      const saved = localStorage.getItem('techparts_cart')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && Array.isArray(parsed.items)) {
          parsed.items.forEach(i => dispatch({ type: 'ADD', product: i, quantity: 0 }))
          // Ajuste cantidades exactas
          parsed.items.forEach(i => dispatch({ type: 'SET_QTY', id: i.id, quantity: i.quantity }))
        }
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('techparts_cart', JSON.stringify({ items: state.items }))
    } catch {}
  }, [state.items])

  const totals = useMemo(() => {
    const subtotal = state.items.reduce((acc, i) => acc + i.price * i.quantity, 0)
    const iva = subtotal * 0.21
    const total = subtotal + iva
    const count = state.items.reduce((acc, i) => acc + i.quantity, 0)
    return { subtotal, iva, total, count }
  }, [state.items])

  // Función para validar stock antes de agregar al carrito
  const canAddToCart = (product, quantity = 1) => {
    const existingItem = state.items.find(i => i.id === product.id)
    const currentQuantity = existingItem ? existingItem.quantity : 0
    const totalQuantity = currentQuantity + quantity
    return totalQuantity <= product.stock
  }

  // Función para validar stock antes del checkout
  const canCheckout = () => {
    return state.items.every(item => {
      const product = products.find(p => p.id === item.id)
      return product && item.quantity <= product.stock
    })
  }

  // Función para realizar checkout y descontar stock
  const checkout = async () => {
    if (!canCheckout()) {
      throw new Error('No hay stock suficiente para algunos productos')
    }

    try {
      // Descontar stock de todos los productos usando la API
      const promises = state.items.map(item => 
        decrementProductStock(item.id, item.quantity)
      )
      await Promise.all(promises)

      // Limpiar carrito
      dispatch({ type: 'CHECKOUT' })
    } catch (error) {
      console.error('Error en checkout:', error)
      throw new Error('Error al procesar la compra. Inténtalo de nuevo.')
    }
  }

  const value = useMemo(() => ({
    items: state.items,
    addToCart: (product, quantity = 1) => {
      if (canAddToCart(product, quantity)) {
        dispatch({ type: 'ADD', product, quantity })
      } else {
        throw new Error('No hay stock suficiente para este producto')
      }
    },
    removeFromCart: (id) => dispatch({ type: 'REMOVE', id }),
    setQuantity: (id, quantity) => {
      const item = state.items.find(i => i.id === id)
      if (item) {
        const product = products.find(p => p.id === id)
        if (product && quantity <= product.stock) {
          dispatch({ type: 'SET_QTY', id, quantity })
        } else {
          throw new Error('No hay stock suficiente para esta cantidad')
        }
      }
    },
    clearCart: () => dispatch({ type: 'CLEAR' }),
    canAddToCart,
    canCheckout,
    checkout,
    totals,
  }), [state.items, totals, products, decrementProductStock])

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}

