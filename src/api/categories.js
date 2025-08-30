import api from './index'

export const categoriesAPI = {
  // Obtener todas las categorías
  getAll: async () => {
    const response = await api.get('/categories')
    return response.data
  },

  // Obtener categoría por ID
  getById: async (id) => {
    const response = await api.get(`/categories/${id}`)
    return response.data
  }
}
