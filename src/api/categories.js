/**
 * API DE GESTIÓN DE CATEGORÍAS ARTÍSTICAS
 * 
 * Este módulo maneja las operaciones relacionadas con categorías de arte:
 * - Obtener listado de categorías disponibles
 * - Recuperar información específica de una categoría
 * 
 * Las categorías organizan las obras de arte en grupos como:
 * - Pintura
 * - Escultura
 * - Fotografía
 * - Arte Digital
 * - Etc.
 * 
 * Utiliza Spring Boot backend para gestión real de categorías.
 * 
 * Patrón de diseño: API Object simple para operaciones de lectura
 * Beneficios: Interfaz limpia y extensible para futuras funcionalidades
 */

import api from './index'

/**
 * OBJETO API DE CATEGORÍAS
 * 
 * Contiene métodos para obtener información de categorías artísticas.
 * Actualmente solo incluye operaciones de lectura, pero puede
 * extenderse para incluir CRUD completo si se requiere.
 */
export const categoriesAPI = {
  /**
   * OBTENER TODAS LAS CATEGORÍAS
   * 
   * Recupera la lista completa de categorías artísticas disponibles.
   * Utilizado para:
   * - Menús de navegación
   * - Filtros de búsqueda
   * - Formularios de creación de productos
   * - Páginas de categorías
   * 
   * @returns {Promise<Array>} Array de categorías con sus propiedades
   * @example
   * const categories = await categoriesAPI.getAll()
   * // Retorna: [{ id: 1, name: "Pintura", slug: "pintura" }, ...]
   */
  getAll: async () => {
    try {
      console.log('📡 Solicitando categorías al backend...')
      const response = await api.get('/categorias')
      console.log('📡 Respuesta de categorías:', response.data)
      
      // Normalizar campos del backend (español a inglés)
      const normalizedCategories = response.data.map(cat => ({
        ...cat,
        name: cat.name || cat.nombre || cat.nombreCategoria || `Categoría ${cat.id}`,
        slug: cat.slug || cat.nombreCategoria?.toLowerCase().replace(/\s+/g, '-')
      }))
      
      console.log('📡 Categorías normalizadas:', normalizedCategories)
      return normalizedCategories
    } catch (error) {
      console.error('❌ Error al obtener categorías:', error)
      throw new Error(error.response?.data?.message || 'Error al cargar categorías')
    }
  },

  /**
   * OBTENER CATEGORÍA POR ID
   * 
   * Recupera información detallada de una categoría específica.
   * Útil para:
   * - Páginas individuales de categoría
   * - Información contextual en productos
   * - Validación de categorías existentes
   * 
   * @param {number} id - ID único de la categoría
   * @returns {Promise<Object>} Datos completos de la categoría
   * @example
   * const category = await categoriesAPI.getById(1)
   * // Retorna: { id: 1, name: "Pintura", description: "...", slug: "pintura" }
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/categorias/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener categoría')
    }
  }
}
