import api from './index'

export const authAPI = {
  // Login de usuario
  login: async (email, password) => {
    const response = await api.get('/users')
    const user = response.data.find(u => u.email === email && u.password === password)
    
    if (!user) {
      throw new Error('Credenciales inválidas')
    }
    
    // No enviar password en la respuesta
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  },

  // Registro de usuario
  register: async (userData) => {
    // Verificar si el email ya existe
    const existingUsers = await api.get('/users')
    const emailExists = existingUsers.data.some(u => u.email === userData.email)
    
    if (emailExists) {
      throw new Error('El email ya está registrado')
    }

    // Crear nuevo usuario
    const newUser = {
      ...userData,
      id: Date.now(),
      role: 'user'
    }

    const response = await api.post('/users', newUser)
    const { password: _, ...userWithoutPassword } = response.data
    return userWithoutPassword
  },

  // Obtener usuario por ID
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`)
    const { password: _, ...userWithoutPassword } = response.data
    return userWithoutPassword
  }
}
