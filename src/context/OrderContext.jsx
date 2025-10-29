/**
 * CONTEXTO DE GESTIÓN DE ÓRDENES DE COMPRA
 * 
 * Este contexto maneja todo lo relacionado con las órdenes de compra:
 * - Almacenamiento del historial de compras del usuario
 * - Carga automática de órdenes cuando el usuario inicia sesión
 * - Creación de nuevas órdenes durante el checkout
 * - Estados de carga y error para la UI
 * 
 * Depende del UserContext para obtener información del usuario autenticado
 * y solo carga órdenes cuando hay un usuario válido conectado.
 * 
 * Patrón de diseño: Context API con dependencia de otro contexto
 * Beneficios: Gestión centralizada del historial de compras y sincronización automática
 */

import { createContext, useContext, useState, useEffect } from 'react'
import { ordersAPI } from '../api/orders'
import { useUser } from '../context/UserContext'

/**
 * CONTEXTO DE ÓRDENES
 * 
 * Crea el contexto que compartirá el estado de órdenes
 * entre todos los componentes de la aplicación.
 */
const OrderContext = createContext(null)

/**
 * PROVEEDOR DE CONTEXTO DE ÓRDENES
 * 
 * Componente que envuelve la aplicación y proporciona el estado
 * y métodos de órdenes a todos los componentes hijos.
 * 
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 */
export function OrderProvider({ children }) {
  // Obtener datos del usuario desde UserContext
  const { user, isAuthenticated } = useUser()
  
  // Estados del contexto de órdenes
  const [orders, setOrders] = useState([])                    // Lista de órdenes
  const [loadingOrders, setLoadingOrders] = useState(true)    // Estado de carga
  const [errorOrders, setErrorOrders] = useState(null)       // Estado de error

  /**
   * EFECTO DE CARGA DE ÓRDENES DEL USUARIO
   * 
   * Se ejecuta cuando cambia el estado de autenticación o el usuario.
   * Solo carga órdenes si hay un usuario autenticado válido.
   */
  useEffect(() => {
    /**
     * FUNCIÓN INTERNA PARA CARGAR ÓRDENES
     * 
     * Maneja la lógica de carga de órdenes con validación
     * de autenticación y manejo de errores.
     */
    const loadUserOrders = async () => {
      // Verificar que el usuario esté autenticado y tenga un token válido
      const token = localStorage.getItem('token')
      if (isAuthenticated && user?.id && token) {
        try {
          setLoadingOrders(true)                    // Activar estado de carga
          setErrorOrders(null)                      // Limpiar errores previos
          
          // Obtener órdenes del usuario desde la API
          const data = await ordersAPI.getOrdersByUser(user.id)
          setOrders(Array.isArray(data) ? data : []) // Validar que data sea un array
        } catch (err) {
          console.error('Error al cargar órdenes:', err)
          
          // Manejo específico según el tipo de error
          if (err.message?.includes('403') || err.response?.status === 403) {
            setErrorOrders('No tienes permisos para ver el historial de compras.')
          } else if (err.message?.includes('401') || err.response?.status === 401) {
            setErrorOrders('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.')
          } else {
            setErrorOrders('Error al cargar el historial de compras.')
          }
        } finally {
          setLoadingOrders(false)                  // Desactivar estado de carga
        }
      } else {
        // Si no hay usuario autenticado, limpiar órdenes
        setOrders([])
        setLoadingOrders(false)
      }
    }

    loadUserOrders()
  }, [isAuthenticated, user?.id])  // Dependencias: se ejecuta cuando cambian

  /**
   * AGREGAR NUEVA ORDEN
   * 
   * Crea una nueva orden en la API y la añade al estado local.
   * Utilizada durante el proceso de checkout para registrar la compra.
   * 
   * @param {Object} orderData - Datos completos de la orden
   * @param {number} orderData.userId - ID del usuario que compra
   * @param {Array} orderData.items - Productos comprados con cantidades
   * @param {number} orderData.total - Total de la compra
   * @param {string} orderData.date - Fecha de la orden en formato ISO
   * @param {string} orderData.status - Estado de la orden
   * @returns {Promise<Object>} Orden creada con ID asignado
   * @throws {Error} Si ocurre un error al crear la orden
   */
  const addOrder = async (orderData) => {
    try {
      // Crear orden en la API
      const newOrder = await ordersAPI.createOrder(orderData)
      
      // Añadir al inicio de la lista (orden más reciente primero)
      setOrders(prevOrders => [newOrder, ...prevOrders])
      
      return newOrder
    } catch (err) {
      console.error('Error al crear orden:', err)
      throw err  // Re-lanzar error para que el componente lo maneje
    }
  }

  /**
   * VALOR DEL CONTEXTO
   * 
   * Objeto que contiene todo el estado y métodos que estarán
   * disponibles para los componentes que consuman este contexto.
   */
  const value = {
    orders,           // Array de órdenes del usuario
    loadingOrders,    // Estado de carga de órdenes
    errorOrders,      // Estado de error al cargar órdenes
    addOrder          // Función para crear nuevas órdenes
  }

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  )
}

/**
 * HOOK PERSONALIZADO PARA USAR EL CONTEXTO
 * 
 * Hook que simplifica el uso del OrderContext y añade validación
 * para asegurar que se use dentro del Provider correspondiente.
 * 
 * @returns {Object} Estado y métodos del contexto de órdenes
 * @throws {Error} Si se usa fuera del OrderProvider
 * 
 * @example
 * const { orders, loadingOrders, addOrder } = useOrders()
 */
export function useOrders() {
  const ctx = useContext(OrderContext)
  if (!ctx) {
    throw new Error('useOrders debe usarse dentro de OrderProvider')
  }
  return ctx
}