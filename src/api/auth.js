import api from './index'

//esto es lo que se comunica directamente con db.json que es en donde estan todos pre-seteados los usuarios que seria el json-server
export const authAPI = {
  // Login de usuario
  login: async (email, password) => {
    const response = await api.get('/users') //trae todos los usuarios
    const user = response.data.find(u => u.email === email && u.password === password)//busca el usuario con los parametros pasados en la funcion
    if (!user) {
      throw new Error('Credenciales inválidas')
    }

    // No enviar password en la respuesta, para no filtrarla en texto plano
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  },

  // Registro de usuario
  register: async (userData) => {
    // Verificar si el email ya existe
    const existingUsers = await api.get('/users')//los obtiene todos para no crear uno ya existente
    const emailExists = existingUsers.data.some(u => u.email === userData.email)//valida existencia
    
    if (emailExists) {
      throw new Error('El email ya está registrado')
    }

    // Crear nuevo usuario
    const newUser   = {
      ...userData,
      id: Date.now(),//es tipo timestamp
      role: 'user'
    }

    const response = await api.post('/users', newUser)//hace un post en el json-server (db.json)
    const { password: _, ...userWithoutPassword } = response.data
    return userWithoutPassword
  },

  // Obtener usuario por ID
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`)
    const { password: _, ...userWithoutPassword } = response.data
    return userWithoutPassword
  },

  // Actualizar usuario (nombre, email, etc.)
  updateUser : async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData)
    const { password: _, ...userWithoutPassword } = response.data
    return userWithoutPassword
  },

  // Cambiar contraseña
  changePassword: async (id, currentPassword, newPassword) => {
    // Nota: En producción, el backend debe verificar currentPassword
    // Aquí solo se actualiza la contraseña directamente
    const response = await api.patch(`/users/${id}`, { password: newPassword })
    const { password: _, ...userWithoutPassword } = response.data
    return userWithoutPassword
  }
}