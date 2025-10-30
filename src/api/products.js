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
 * Utiliza Spring Boot backend para gestión real de productos.
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
    try {
      const response = await api.get('/productos')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener productos')
    }
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
    try {
      const response = await api.get(`/productos/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener producto')
    }
  },

  /**
   * CREAR NUEVO PRODUCTO
   * 
   * Añade un nuevo producto/obra de arte al catálogo.
   * Utilizado por artistas para publicar nuevas obras.
   * 
   * @param {Object} productData - Datos del nuevo producto
   * @returns {Promise<Object>} Producto creado con ID asignado
   */
  create: async (productData) => {
    try {
      console.log('📡 Enviando producto al backend:', productData)
      const response = await api.post('/productos', productData)
      console.log('✅ Producto creado exitosamente:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error al crear producto:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        productData: productData
      })
      throw new Error(error.response?.data?.message || 'Los datos proporcionados no son válidos')
    }
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
    try {
      console.log('📡 Actualizando producto en backend:', productData)
      const response = await api.put(`/productos/${id}`, productData)
      console.log('✅ Producto actualizado exitosamente:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error al actualizar producto:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        productData: productData
      })
      throw new Error(error.response?.data?.message || 'Error al actualizar producto')
    }
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
    try {
      // Primero obtener el producto completo
      const currentProduct = await productsAPI.getById(id)
      
      // Actualizar solo el stock manteniendo los demás campos
      const updatedProduct = {
        ...currentProduct,
        stock: newStock
      }
      
      // Usar PUT para actualizar el producto completo
      const response = await api.put(`/productos/${id}`, updatedProduct)
      return response.data
    } catch (error) {
      console.error('❌ Error al actualizar stock:', error)
      throw new Error(error.response?.data?.message || 'Error al actualizar stock')
    }
  },

  /**
   * DECREMENTAR STOCK (COMPRA)
   * 
   * Reduce el stock disponible cuando se realiza una compra.
   * Utiliza el endpoint específico del backend para decrementar stock.
   * Utilizado durante el proceso de checkout.
   * 
   * @param {number} id - ID del producto
   * @param {number} quantity - Cantidad a descontar
   * @returns {Promise<Object>} Producto con stock actualizado
   */
  decrementStock: async (id, quantity) => {
    try {
      console.log(`📦 Decrementando stock del producto ${id} en ${quantity} unidades`)
      
      // Usar el endpoint específico del backend para decrementar stock
      const response = await api.put(`/productos/${id}/decrementar-stock?cantidad=${quantity}`)
      
      console.log('✅ Stock decrementado exitosamente:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error al decrementar stock:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        productId: id,
        quantity: quantity
      })
      
      // Manejar diferentes tipos de errores
      if (error.response?.status === 400) {
        throw new Error(error.response?.data?.message || 'Stock insuficiente para realizar la compra')
      } else if (error.response?.status === 404) {
        throw new Error('Producto no encontrado')
      } else if (error.response?.status === 401) {
        throw new Error('Debes iniciar sesión para realizar la compra')
      }
      
      throw new Error(error.response?.data?.message || 'Error al decrementar stock')
    }
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
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/productos/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar producto')
    }
  },

  /**
   * OBTENER PRODUCTOS POR CATEGORÍA
   * 
   * Filtra productos por categoría artística.
   * Utilizado en páginas de categorías específicas.
   * 
   * @param {string} categoryId - ID de la categoría
   * @returns {Promise<Array>} Productos de la categoría especificada
   */
  getByCategory: async (categoryId) => {
    try {
      const response = await api.get(`/productos/categoria/${categoryId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener productos por categoría')
    }
  },

  /**
   * OBTENER PRODUCTOS POR ARTISTA
   * 
   * Recupera todas las obras de un artista específico.
   * Utilizado en perfiles de artista y gestión personal de obras.
   * 
   * @param {number} artistId - ID del artista
   * @returns {Promise<Array>} Productos del artista especificado
   */
  getByArtist: async (artistId) => {
    try {
      const response = await api.get(`/productos/artista/${artistId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener productos por artista')
    }
  },

  /**
   * BUSCAR PRODUCTOS
   * 
   * Realiza búsqueda de productos por texto.
   * 
   * @param {string} query - Término de búsqueda
   * @returns {Promise<Array>} Productos que coinciden con la búsqueda
   */
  search: async (query) => {
    try {
      const response = await api.get(`/productos/buscar?q=${encodeURIComponent(query)}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al buscar productos')
    }
  }
}
