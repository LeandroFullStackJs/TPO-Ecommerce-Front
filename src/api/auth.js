/**
 * API DE AUTENTICACIÓN Y GESTIÓN DE USUARIOS
 * 
 * Este módulo gestiona todas las operaciones relacionadas con usuarios:
 * - Autenticación (login/logout)
 * - Registro de nuevos usuarios
 * - Actualización de datos de usuario
 * - Cambio de contraseñas
 * 
 * Utiliza json-server como backend simulado para desarrollo.
 * En producción, estas operaciones serían manejadas por un backend real
 * con validaciones de seguridad, encriptación de contraseñas y JWT tokens.
 * 
 * Patrón de diseño: API Object con métodos específicos para cada operación
 * Beneficios: Separación de responsabilidades y fácil testing
 */

import api from './index'

/**
 * OBJETO API DE AUTENTICACIÓN
 * 
 * Contiene todos los métodos para operaciones de usuario y autenticación.
 * Cada método es una función async que devuelve una Promise.
 * una funcion async es una funcion que trabaja de manera asincronica , 
 * es decir que puede pausar su ejecucion en ciertos puntos (usando la palabra clave await) 
 * hasta que una promesa se resuelva o rechace, permitiendo escribir codigo asincronico de manera mas sencilla 
 * y legible, como si fuera sincrono.
 */
export const authAPI = {
  /**
   * INICIO DE SESIÓN
   * 
   * Autentica a un usuario verificando email y contraseña contra la base de datos.
   * En un entorno de producción, esto incluiría hashing de contraseñas y JWT tokens.
   * 
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<Object>} Usuario sin contraseña
   * @throws {Error} Si las credenciales son inválidas
   */
  login: async (email, password) => {
    // Obtener todos los usuarios (en producción sería un endpoint específico)
    const response = await api.get('/users')
    
    // Buscar usuario que coincida con email y contraseña
    const user = response.data.find(u => u.email === email && u.password === password)
    
    if (!user) {
      throw new Error('Credenciales inválidas')
    }

    // Remover contraseña por seguridad antes de devolver el usuario
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  },

  /**
   * REGISTRO DE NUEVO USUARIO
   * 
   * Crea una nueva cuenta de usuario verificando que el email no esté en uso.
   * Asigna un ID único y rol por defecto.
   * 
   * @param {Object} userData - Datos del nuevo usuario
   * @param {string} userData.email - Email único del usuario
   * @param {string} userData.password - Contraseña del usuario
   * @param {string} userData.name - Nombre del usuario
   * @returns {Promise<Object>} Usuario creado sin contraseña
   * @throws {Error} Si el email ya está registrado
   */
  register: async (userData) => {
    // Verificar si el email ya está en uso
    const existingUsers = await api.get('/users')
    const emailExists = existingUsers.data.some(u => u.email === userData.email)
    
    if (emailExists) {
      throw new Error('El email ya está registrado')
    }

    // Crear nuevo usuario con datos adicionales
    const newUser = {
      ...userData,
      id: Date.now(), // ID único basado en timestamp
      role: 'user'    // Rol por defecto
    }

    // Guardar en la base de datos
    const response = await api.post('/users', newUser)
    
    // Devolver usuario sin contraseña por seguridad
    const { password: _, ...userWithoutPassword } = response.data
    return userWithoutPassword
  },

  /**
   * OBTENER USUARIO POR ID
   * 
   * Recupera los datos de un usuario específico por su ID.
   * Útil para obtener información actualizada del perfil.
   * 
   * @param {number} id - ID único del usuario
   * @returns {Promise<Object>} Usuario sin contraseña
   */
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`)
    const { password: _, ...userWithoutPassword } = response.data
    return userWithoutPassword
  },

  /**
   * ACTUALIZAR DATOS DE USUARIO
   * 
   * Actualiza la información del perfil de usuario (nombre, email, etc.)
   * excepto la contraseña que tiene su propio método.
   * 
   * @param {number} id - ID del usuario a actualizar
   * @param {Object} userData - Nuevos datos del usuario
   * @returns {Promise<Object>} Usuario actualizado sin contraseña
   */
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData)
    const { password: _, ...userWithoutPassword } = response.data
    return userWithoutPassword
  },

  /**
   * CAMBIAR CONTRASEÑA
   * 
   * Actualiza la contraseña de un usuario. En producción incluiría
   * verificación de la contraseña actual y hashing de la nueva.
   * 
   * @param {number} id - ID del usuario
   * @param {string} currentPassword - Contraseña actual (para verificación)
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise<Object>} Usuario actualizado sin contraseña
   * 
   * @note En producción, el backend debe verificar currentPassword
   *       y encriptar newPassword antes de guardarlo
   */
  changePassword: async (id, currentPassword, newPassword) => {
    // NOTA: En producción, se debe verificar currentPassword
    // y hacer hash de newPassword antes de guardarlo
    const response = await api.patch(`/users/${id}`, { password: newPassword })
    const { password: _, ...userWithoutPassword } = response.data
    return userWithoutPassword
  }
}