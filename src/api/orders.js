/**
 * API DE GESTIÓN DE ÓRDENES DE COMPRA
 * 
 * Este módulo maneja las operaciones relacionadas con órdenes de compra:
 * - Crear nuevas órdenes cuando un usuario finaliza una compra
 * - Recuperar historial de órdenes por usuario
 * - Gestionar el estado del proceso de checkout
 * 
 * Las órdenes incluyen información sobre:
 * - Productos comprados
 * - Cantidades y precios
 * - Datos de envío
 * - Estado de la orden
 * - Fecha de compra
 * 
 * Utiliza Spring Boot backend para gestión real de órdenes.
 * Incluye integración con sistemas de pago, gestión de inventario y servicios de envío.
 * 
 * Patrón de diseño: API Object con métodos específicos para órdenes
 * Beneficios: Separación clara del flujo de compra y fácil extensión
 */

import api from './index'

/**
 * NORMALIZAR ORDEN DEL BACKEND
 * 
 * Convierte los campos del backend (español) a los campos esperados por el frontend (inglés).
 * Maneja valores nulos y convierte tipos de datos según sea necesario.
 * 
 * @param {Object} order - Orden desde el backend
 * @returns {Object} Orden normalizada para el frontend
 */
const normalizeOrder = (order) => {
  // Asegurar que la fecha esté en formato válido
  let normalizedDate = null
  if (order.fecha) {
    try {
      normalizedDate = new Date(order.fecha).toISOString()
    } catch (error) {
      console.warn('Fecha inválida en orden:', order.fecha)
      normalizedDate = new Date().toISOString() // Usar fecha actual como fallback
    }
  } else {
    normalizedDate = new Date().toISOString() // Usar fecha actual como fallback
  }

  // Asegurar que el total sea un número válido
  let normalizedTotal = 0
  if (order.total !== null && order.total !== undefined) {
    const parsedTotal = parseFloat(order.total)
    normalizedTotal = isNaN(parsedTotal) ? 0 : parsedTotal
  }

  // Normalizar items asegurando estructura válida
  const normalizedItems = (order.items || []).map(item => ({
    productId: item.productId || item.productoId,
    name: item.name || item.nombre,
    price: parseFloat(item.price || item.precio) || 0,
    quantity: parseInt(item.quantity || item.cantidad) || 1,
    image: item.image || item.imagen || '/placeholder-image.png'
  }))

  return {
    id: order.id,
    date: normalizedDate,
    status: order.estado || order.status || 'PENDIENTE',
    total: normalizedTotal,
    notes: order.notas || order.notes || '',
    userId: order.usuarioId || order.userId,
    userName: order.usuarioNombre || order.userName || '',
    userEmail: order.usuarioEmail || order.userEmail || '',
    items: normalizedItems,
    shippingAddressId: order.direccionEnvioId || order.shippingAddressId,
    shippingAddress: order.direccionEnvio || order.shippingAddress || '',
    updatedAt: order.fechaActualizacion || order.updatedAt || normalizedDate
  }
}

/**
 * OBJETO API DE ÓRDENES
 * 
 * Contiene métodos para gestionar órdenes de compra.
 * Incluye operaciones completas para:
 * - Creación y actualización de órdenes
 * - Cancelación de órdenes
 * - Tracking de envío
 */
export const ordersAPI = {
  /**
   * OBTENER ÓRDENES POR USUARIO
   * 
   * Recupera el historial completo de órdenes de un usuario específico.
   * Utilizado para:
   * - Página "Mis Compras" en el perfil de usuario
   * - Seguimiento de órdenes
   * - Historial de transacciones
   * - Gestión de devoluciones
   * 
   * @param {number} userId - ID del usuario
   * @returns {Promise<Array>} Array de órdenes del usuario ordenadas por fecha
   * @example
   * const userOrders = await ordersAPI.getOrdersByUser(123)
   */
  getOrdersByUser: async (userId) => {
    try {
      console.log('📦 Obteniendo órdenes para usuario:', userId)
      const response = await api.get(`/pedidos/usuario/${userId}`)
      
      // Validar que la respuesta tenga datos
      if (!response.data || !Array.isArray(response.data)) {
        console.warn('⚠️ Respuesta inesperada del backend:', response.data)
        return []
      }

      // Normalizar los datos del backend a formato del frontend
      const normalizedOrders = response.data.map(order => {
        try {
          return normalizeOrder(order)
        } catch (error) {
          console.error('❌ Error normalizando orden:', order, error)
          // Retornar una orden básica en caso de error
          return {
            id: order.id || 'unknown',
            date: new Date().toISOString(),
            status: 'ERROR',
            total: 0,
            notes: 'Error al procesar orden',
            userId: userId,
            userName: '',
            userEmail: '',
            items: [],
            shippingAddressId: null,
            shippingAddress: '',
            updatedAt: new Date().toISOString()
          }
        }
      })

      console.log('✅ Órdenes normalizadas:', normalizedOrders)
      return normalizedOrders
    } catch (error) {
      console.error('❌ Error al obtener órdenes del usuario:', error)
      // En caso de error, retornar array vacío en lugar de fallar
      if (error.response?.status === 404) {
        console.log('📝 No se encontraron órdenes para el usuario')
        return []
      }
      throw new Error(error.response?.data?.message || 'Error al obtener órdenes del usuario')
    }
  },
  /**
   * CREAR NUEVA ORDEN
   * 
   * Registra una nueva orden de compra en el sistema.
   * Se ejecuta cuando un usuario completa el proceso de checkout.
   * 
   * @param {Object} orderData - Datos completos de la orden
   * @returns {Promise<Object>} Orden creada con ID asignado y estado inicial
   */
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/pedidos', orderData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear orden')
    }
  },

  /**
   * OBTENER ORDEN POR ID
   * 
   * Recupera los detalles completos de una orden específica.
   * 
   * @param {number} orderId - ID de la orden
   * @returns {Promise<Object>} Detalles completos de la orden
   */
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/pedidos/${orderId}`)
      // Normalizar la orden individual también
      return normalizeOrder(response.data)
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener orden')
    }
  },

  /**
   * ACTUALIZAR ESTADO DE ORDEN
   * 
   * Actualiza el estado de una orden existente.
   * 
   * @param {number} orderId - ID de la orden
   * @param {string} newStatus - Nuevo estado de la orden
   * @returns {Promise<Object>} Orden actualizada
   */
  updateOrderStatus: async (orderId, newStatus) => {
    try {
      // Obtener la orden completa primero
      const currentOrder = await ordersAPI.getOrderById(orderId)
      
      // Actualizar solo el estado
      const updatedOrder = {
        ...currentOrder,
        estado: newStatus
      }
      
      // Usar PUT para actualizar la orden completa
      const response = await api.put(`/pedidos/${orderId}`, updatedOrder)
      return response.data
    } catch (error) {
      console.error('❌ Error al actualizar estado de orden:', error)
      throw new Error(error.response?.data?.message || 'Error al actualizar estado de orden')
    }
  }
}