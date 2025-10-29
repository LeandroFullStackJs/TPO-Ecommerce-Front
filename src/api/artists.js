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
 * Utiliza Spring Boot backend para gestión real de artistas.
 */

import api from './index'

export const artistsAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/artistas')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener artistas')
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/artistas/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener artista')
    }
  },

  create: async (artistData) => {
    try {
      const response = await api.post('/artistas', artistData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear artista')
    }
  },

  update: async (id, artistData) => {
    try {
      const response = await api.put(`/artistas/${id}`, artistData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar artista')
    }
  },

  deleteArtist: async (id) => {
    try {
      await api.delete(`/artistas/${id}`)
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar artista')
    }
  },

  getByCategory: async (categoryId) => {
    try {
      const response = await api.get(`/artistas/categoria/${categoryId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener artistas por categoría')
    }
  },

  search: async (searchTerm) => {
    try {
      const response = await api.get(`/artistas/buscar?q=${encodeURIComponent(searchTerm)}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al buscar artistas')
    }
  }
}