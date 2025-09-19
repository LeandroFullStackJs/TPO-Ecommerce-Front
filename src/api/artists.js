/**
 * API DE ARTISTAS
 * 
 * Este módulo gestiona todas las operaciones relacionadas con artistas:
 * - Obtener lista de artistas
 * - Obtener artista por ID
 * - Crear nuevo artista
 * - Actualizar información de artista
 * - Eliminar artista
 * 
 * Utiliza la instancia configurada de axios para mantener consistencia
 * con el resto de la aplicación y aprovechar los interceptors.
 * 
 * Patrón de diseño: API Object con métodos específicos para cada operación
 * Beneficios: Separación de responsabilidades, reutilización y fácil testing
 */

import api from './index'

/**
 * OBJETO API DE ARTISTAS
 * 
 * Contiene todos los métodos para operaciones CRUD de artistas.
 * Cada método utiliza la instancia configurada de axios que incluye
 * manejo automático de errores, timeout y headers por defecto.
 */
export const artistsAPI = {
  /**
   * OBTENER TODOS LOS ARTISTAS
   * 
   * Recupera la lista completa de artistas registrados en la plataforma.
   * Incluye información básica como nombre, categoría, imagen y estadísticas.
   * 
   * @returns {Promise<Array>} Lista de artistas con sus datos básicos
   * @throws {Error} Si falla la petición al servidor
   */
  getAll: async () => {
    const response = await api.get('/artists')
    return response.data
  },

  /**
   * OBTENER ARTISTA POR ID
   * 
   * Recupera la información detallada de un artista específico.
   * Incluye biografía completa, obras, estadísticas y datos de contacto.
   * 
   * @param {number} id - ID único del artista
   * @returns {Promise<Object>} Datos completos del artista
   * @throws {Error} Si el artista no existe o falla la petición
   */
  getById: async (id) => {
    const response = await api.get(`/artists/${id}`)
    return response.data
  },

  /**
   * CREAR NUEVO ARTISTA
   * 
   * Registra un nuevo artista en la plataforma. Útil para usuarios
   * que quieren convertirse en artistas o para administradores.
   * 
   * @param {Object} artistData - Datos del nuevo artista
   * @param {string} artistData.name - Nombre completo del artista
   * @param {string} artistData.bio - Biografía del artista
   * @param {string} artistData.image - URL de la imagen de perfil
   * @param {number} artistData.categoryId - ID de la categoría artística
   * @param {string} artistData.email - Email de contacto
   * @returns {Promise<Object>} Artista creado con ID asignado
   * @throws {Error} Si faltan datos requeridos o falla la creación
   */
  create: async (artistData) => {
    const response = await api.post('/artists', artistData)
    return response.data
  },

  /**
   * ACTUALIZAR ARTISTA
   * 
   * Actualiza la información de un artista existente.
   * Solo el propio artista o administradores pueden realizar esta acción.
   * 
   * @param {number} id - ID del artista a actualizar
   * @param {Object} artistData - Nuevos datos del artista (parcial)
   * @returns {Promise<Object>} Artista actualizado
   * @throws {Error} Si no tiene permisos o falla la actualización
   */
  update: async (id, artistData) => {
    const response = await api.put(`/artists/${id}`, artistData)
    return response.data
  },

  /**
   * ELIMINAR ARTISTA
   * 
   * Elimina un artista de la plataforma. Esta acción también puede
   * afectar las obras asociadas dependiendo de la lógica del backend.
   * 
   * @param {number} id - ID del artista a eliminar
   * @returns {Promise<void>}
   * @throws {Error} Si no tiene permisos o falla la eliminación
   */
  delete: async (id) => {
    await api.delete(`/artists/${id}`)
  },

  /**
   * OBTENER ARTISTAS POR CATEGORÍA
   * 
   * Filtra artistas según su categoría artística.
   * Útil para mostrar artistas de un estilo específico.
   * 
   * @param {number} categoryId - ID de la categoría a filtrar
   * @returns {Promise<Array>} Lista de artistas de la categoría especificada
   * @throws {Error} Si falla la petición al servidor
   */
  getByCategory: async (categoryId) => {
    const response = await api.get(`/artists?categoryId=${categoryId}`)
    return response.data
  },

  /**
   * BUSCAR ARTISTAS
   * 
   * Busca artistas por nombre o biografía usando texto libre.
   * Implementa búsqueda parcial para mejor experiencia de usuario.
   * 
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Promise<Array>} Lista de artistas que coinciden con la búsqueda
   * @throws {Error} Si falla la petición al servidor
   */
  search: async (searchTerm) => {
    const response = await api.get(`/artists?search=${encodeURIComponent(searchTerm)}`)
    return response.data
  }
}