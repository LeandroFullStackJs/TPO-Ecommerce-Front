import api from './index'

export const ordersAPI = {
  // Obtener órdenes por ID de usuario
  getOrdersByUser:  async (userId) => {
    const response = await api.get(`/orders?userId=${userId}`)
    return response.data
  },

  // Crear una nueva orden
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData)
    return response.data
  }
}