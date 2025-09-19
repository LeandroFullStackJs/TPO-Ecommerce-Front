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
 * Utiliza json-server como backend simulado para desarrollo.
 * En producción, esto incluiría integración con sistemas de pago,
 * gestión de inventario y servicios de envío.
 * 
 * Patrón de diseño: API Object con métodos específicos para órdenes
 * Beneficios: Separación clara del flujo de compra y fácil extensión
 */

import api from './index'

/**
 * OBJETO API DE ÓRDENES
 * 
 * Contiene métodos para gestionar órdenes de compra.
 * Actualmente incluye operaciones básicas que pueden
 * extenderse con funcionalidades adicionales como:
 * - Actualización de estado de órdenes
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
   * // Retorna: [{ id: 1, userId: 123, products: [...], total: 150, date: "2024-01-15" }, ...]
   */
  getOrdersByUser: async (userId) => {
    const response = await api.get(`/orders?userId=${userId}`)
    return response.data
  },

  /**
   * CREAR NUEVA ORDEN
   * 
   * Registra una nueva orden de compra en el sistema.
   * Se ejecuta cuando un usuario completa el proceso de checkout.
   * 
   * Incluye toda la información necesaria para procesar la compra:
   * - Productos y cantidades
   * - Información de envío
   * - Método de pago
   * - Totales calculados
   * 
   * @param {Object} orderData - Datos completos de la orden
   * @param {number} orderData.userId - ID del usuario que compra
   * @param {Array} orderData.products - Lista de productos con cantidades
   * @param {number} orderData.total - Total de la compra
   * @param {string} orderData.status - Estado inicial de la orden
   * @param {Object} orderData.shippingInfo - Información de envío
   * @param {string} orderData.paymentMethod - Método de pago utilizado
   * @returns {Promise<Object>} Orden creada con ID asignado y estado inicial
   * 
   * @example
   * const newOrder = await ordersAPI.createOrder({
   *   userId: 123,
   *   products: [{ id: 1, quantity: 2, price: 50 }],
   *   total: 100,
   *   status: 'pending',
   *   shippingInfo: { address: '...', city: '...' },
   *   paymentMethod: 'credit_card'
   * })
   */
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData)
    return response.data
  }
}