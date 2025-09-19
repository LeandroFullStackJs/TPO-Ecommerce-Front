/**
 * API DE GESTIÓN DE PRODUCTOS (OBRAS DE ARTE)
 * 
 * Este módulo maneja todas las operaciones CRUD para productos/obras de arte:
 * - Obtener listados de productos (todos, por categoría, por artista)
 * - Crear nuevos productos
 * - Actualizar información de productos existentes
 * - Gestionar stock e inventario
 * - Eliminar productos
 * 
 * Utiliza json-server como backend simulado para desarrollo.
 * Cada producto representa una obra de arte con propiedades específicas
 * como técnica, dimensiones, año de creación, etc.
 * 
 * Patrón de diseño: API Object con métodos CRUD estándar
 * Beneficios: Interfaz consistente y fácil mantenimiento
 */

import api from './index'

/**
 * OBJETO API DE PRODUCTOS
 * 
 * Contiene todos los métodos para operaciones CRUD de productos.
 * Cada método maneja una operación específica con la base de datos.
 */
export const productsAPI = {
  /**
   * OBTENER TODOS LOS PRODUCTOS
   * 
   * Recupera la lista completa de productos/obras disponibles.
   * Útil para páginas de catálogo general y búsquedas.
   * 
   * @returns {Promise<Array>} Array de todos los productos
   */
  getAll: async () => {
    const response = await api.get('/products')
    return response.data
  },

  /**
   * OBTENER PRODUCTO POR ID
   * 
   * Recupera un producto específico por su ID único.
   * Utilizado en páginas de detalle de producto y actualizaciones.
   * 
   * @param {number} id - ID único del producto
   * @returns {Promise<Object>} Datos completos del producto
   */
  getById: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  /**
   * CREAR NUEVO PRODUCTO
   * 
   * Añade un nuevo producto/obra de arte al catálogo.
   * Utilizado por artistas para publicar nuevas obras.
   * 
   * @param {Object} productData - Datos del nuevo producto
   * @param {string} productData.name - Nombre de la obra
   * @param {string} productData.artist - Nombre del artista
   * @param {string} productData.category - Categoría artística
   * @param {number} productData.price - Precio de venta
   * @param {number} productData.stock - Cantidad disponible
   * @param {string} productData.image - URL de la imagen
   * @param {string} productData.description - Descripción detallada
   * @param {string} productData.dimensions - Dimensiones de la obra
   * @param {string} productData.technique - Técnica utilizada
   * @param {number} productData.year - Año de creación
   * @returns {Promise<Object>} Producto creado con ID asignado
   */
  create: async (productData) => {
    const response = await api.post('/products', productData)
    return response.data
  },

  /**
   * ACTUALIZAR PRODUCTO COMPLETO
   * 
   * Actualiza todos los campos de un producto existente.
   * Utilizado para ediciones completas de productos.
   * 
   * @param {number} id - ID del producto a actualizar
   * @param {Object} productData - Nuevos datos del producto
   * @returns {Promise<Object>} Producto actualizado
   */
  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData)
    return response.data
  },

  /**
   * ACTUALIZAR STOCK ÚNICAMENTE
   * 
   * Actualiza solo el campo stock de un producto.
   * Más eficiente que actualizar todo el producto cuando
   * solo se necesita modificar la cantidad disponible.
   * 
   * @param {number} id - ID del producto
   * @param {number} newStock - Nueva cantidad en stock
   * @returns {Promise<Object>} Producto con stock actualizado
   */
  updateStock: async (id, newStock) => {
    const response = await api.patch(`/products/${id}`, { stock: newStock })
    return response.data
  },

  /**
   * DECREMENTAR STOCK (COMPRA)
   * 
   * Reduce el stock disponible cuando se realiza una compra.
   * Incluye validación para evitar stock negativo.
   * Utilizado durante el proceso de checkout.
   * 
   * @param {number} id - ID del producto
   * @param {number} quantity - Cantidad a descontar
   * @returns {Promise<Object>} Producto con stock actualizado
   */
  decrementStock: async (id, quantity) => {
    // Obtener stock actual del producto
    const product = await productsAPI.getById(id)
    
    // Calcular nuevo stock evitando valores negativos
    const newStock = Math.max(0, product.stock - quantity)
    
    // Actualizar stock en la base de datos
    return productsAPI.updateStock(id, newStock)
  },

  /**
   * ELIMINAR PRODUCTO
   * 
   * Elimina permanentemente un producto del catálogo.
   * Solo debe ser utilizado por el propietario del producto.
   * 
   * @param {number} id - ID del producto a eliminar
   * @returns {Promise<Object>} Confirmación de eliminación
   */
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },

  /**
   * OBTENER PRODUCTOS POR CATEGORÍA
   * 
   * Filtra productos por categoría artística (pintura, escultura, etc.).
   * Utilizado en páginas de categorías específicas.
   * 
   * @param {string} category - Nombre de la categoría
   * @returns {Promise<Array>} Productos de la categoría especificada
   */
  getByCategory: async (category) => {
    const response = await api.get(`/products?category=${category}`)
    return response.data
  },

  /**
   * OBTENER PRODUCTOS POR ARTISTA
   * 
   * Recupera todas las obras de un artista específico.
   * Utilizado en perfiles de artista y gestión personal de obras.
   * 
   * @param {number} userId - ID del usuario/artista
   * @returns {Promise<Array>} Productos del artista especificado
   */
  getByUser: async (userId) => {
    const response = await api.get(`/products?userId=${userId}`)
    return response.data
  }
}
