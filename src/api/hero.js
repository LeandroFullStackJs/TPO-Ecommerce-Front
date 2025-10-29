/**
 * API DE CONTENIDO HERO
 * 
 * Este módulo gestiona las imágenes y contenido de las secciones hero:
 * - Obtener imágenes para carruseles hero
 * - Gestionar banners promocionales
 * - Contenido destacado de la página principal
 * 
 * Utiliza Spring Boot backend para gestión de contenido multimedia.
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
    try {
      const response = await api.get('/hero-images')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener imágenes hero')
    }
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
    try {
      const response = await api.get('/banners-promocionales')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener banners promocionales')
    }
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
    try {
      const response = await api.get('/contenido-destacado')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener contenido destacado')
    }
  },

  /**
   * ACTUALIZAR IMAGEN HERO
   * 
   * Actualiza una imagen hero existente. Solo para administradores.
   * 
   * @param {number} id - ID de la imagen hero
   * @param {Object} imageData - Nuevos datos de la imagen
   * @returns {Promise<Object>} Imagen hero actualizada
   */
  updateHeroImage: async (id, imageData) => {
    try {
      const response = await api.put(`/hero-images/${id}`, imageData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar imagen hero')
    }
  }
}