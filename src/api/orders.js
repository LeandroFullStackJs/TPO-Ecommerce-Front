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
      const response = await api.get(`/pedidos/usuario/${userId}`)
      return response.data
    } catch (error) {
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
      return response.data
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
      const response = await api.patch(`/pedidos/${orderId}/estado`, { estado: newStatus })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar estado de orden')
    }
  }
}