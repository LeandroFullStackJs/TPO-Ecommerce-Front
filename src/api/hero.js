/**
 * API DE CONTENIDO HERO
 * 
 * Este módulo gestiona las imágenes y contenido de las secciones hero:
 * - Obtener imágenes para carruseles hero
 * - Gestionar banners promocionales
 * - Contenido destacado de la página principal
 * 
 * Utiliza la instancia configurada de axios para mantener consistencia
 * con el resto de la aplicación y aprovechar los interceptors.
 */

import api from './index'

/**
 * OBJETO API DE CONTENIDO HERO
 * 
 * Contiene métodos para gestionar el contenido visual principal
 * de la aplicación, incluyendo carruseles e imágenes destacadas.
 */
export const heroAPI = {
  /**
   * OBTENER IMÁGENES HERO
   * 
   * Recupera las imágenes para mostrar en el carrusel principal
   * de la página de inicio. Incluye títulos, descripciones y enlaces.
   * 
   * @returns {Promise<Array>} Lista de imágenes hero con metadatos
   * @throws {Error} Si falla la petición al servidor
   */
  getHeroImages: async () => {
    const response = await api.get('/heroImages')
    return response.data
  },

  /**
   * OBTENER BANNERS PROMOCIONALES
   * 
   * Recupera banners promocionales para mostrar en diferentes
   * secciones de la aplicación.
   * 
   * @returns {Promise<Array>} Lista de banners promocionales
   * @throws {Error} Si falla la petición al servidor
   */
  getPromotionalBanners: async () => {
    const response = await api.get('/promotionalBanners')
    return response.data
  },

  /**
   * OBTENER CONTENIDO DESTACADO
   * 
   * Recupera contenido especial para destacar en la página principal,
   * como anuncios especiales o eventos.
   * 
   * @returns {Promise<Array>} Lista de contenido destacado
   * @throws {Error} Si falla la petición al servidor
   */
  getFeaturedContent: async () => {
    const response = await api.get('/featuredContent')
    return response.data
  },

  /**
   * ACTUALIZAR IMAGEN HERO
   * 
   * Actualiza una imagen hero existente. Solo para administradores.
   * 
   * @param {number} id - ID de la imagen hero
   * @param {Object} imageData - Nuevos datos de la imagen
   * @returns {Promise<Object>} Imagen hero actualizada
   * @throws {Error} Si no tiene permisos o falla la actualización
   */
  updateHeroImage: async (id, imageData) => {
    const response = await api.put(`/heroImages/${id}`, imageData)
    return response.data
  }
}