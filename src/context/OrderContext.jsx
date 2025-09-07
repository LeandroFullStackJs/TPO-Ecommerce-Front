import { createContext, useContext, useState, useEffect } from 'react'
import { ordersAPI } from '../api/orders'
import { useUser } from '../context/UserContext'

const OrderContext = createContext(null)

export function OrderProvider({ children }) {
  const { user, isAuthenticated } = useUser ()
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [errorOrders, setErrorOrders] = useState(null)

  useEffect(() => {
    const loadUserOrders = async () => {
      if (isAuthenticated && user?.id) {
        try {
          setLoadingOrders(true)
          setErrorOrders(null)
          const data = await ordersAPI.getOrdersByUser (user.id)
          setOrders(data)
        } catch (err) {
          console.error('Error al cargar órdenes:', err)
          setErrorOrders('Error al cargar el historial de compras.')
        } finally {
          setLoadingOrders(false)
        }
      } else {
        setOrders([])
        setLoadingOrders(false)
      }
    }
    loadUserOrders()
  }, [isAuthenticated, user?.id])

  const addOrder = async (orderData) => {
    try {
      const newOrder = await ordersAPI.createOrder(orderData)
      setOrders(prevOrders => [newOrder, ...prevOrders])
      return newOrder
    } catch (err) {
      console.error('Error al crear orden:', err)
      throw err
    }
  }

  const value = {
    orders,
    loadingOrders,
    errorOrders,
    addOrder
  }

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrders debe usarse dentro de OrderProvider')
  return ctx
}