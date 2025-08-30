import api from './index'

export const productsAPI = {
  // Obtener todos los productos
  getAll: async () => {
    const response = await api.get('/products')
    return response.data
  },

  // Obtener producto por ID
  getById: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  // Crear nuevo producto
  create: async (productData) => {
    const response = await api.post('/products', productData)
    return response.data
  },

  // Actualizar producto
  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData)
    return response.data
  },

  // Actualizar stock de un producto
  updateStock: async (id, newStock) => {
    const response = await api.patch(`/products/${id}`, { stock: newStock })
    return response.data
  },

  // Descontar stock (usado en checkout)
  decrementStock: async (id, quantity) => {
    const product = await productsAPI.getById(id)
    const newStock = Math.max(0, product.stock - quantity)
    return productsAPI.updateStock(id, newStock)
  },

  // Eliminar producto
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },

  // Obtener productos por categoría
  getByCategory: async (category) => {
    const response = await api.get(`/products?category=${category}`)
    return response.data
  },

  // Obtener productos por usuario
  getByUser: async (userId) => {
    const response = await api.get(`/products?userId=${userId}`)
    return response.data
  }
}
