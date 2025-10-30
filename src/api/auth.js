/**
 * API DE AUTENTICACIÓN Y GESTIÓN DE USUARIOS
 * 
 * Este módulo gestiona todas las operaciones relacionadas con usuarios:
 * - Autenticación (login/logout)
 * - Registro de nuevos usuarios
 * - Actualización de datos de usuario
 * - Cambio de contraseñas
 * 
 * Utiliza Spring Boot backend para manejo real de autenticación
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
   * Autentica a un usuario verificando email y contraseña contra el backend.
   * El backend devuelve un JWT token que se almacena para futuras peticiones.
   * 
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<Object>} Usuario autenticado con token
   * @throws {Error} Si las credenciales son inválidas
   */
  login: async (email, password) => {
    try {
      console.log('📡 Enviando solicitud de login a:', '/auth/login')
      
      const response = await api.post('/auth/login', { email, password })
      
      console.log('📡 Respuesta recibida:', {
        status: response.status,
        data: response.data
      })

      // Si el backend devuelve un token, lo almacenamos
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        // Configurar el header de autorización para futuras peticiones
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
        console.log('🔐 Token configurado en headers')
      }
      
      return response.data
    } catch (error) {
      console.error('❌ Error en authAPI.login:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      
      // Proporcionar mensajes más específicos basados en el código de error
      if (error.response?.status === 401) {
        throw new Error('Email o contraseña incorrectos')
      } else if (error.response?.status === 404) {
        throw new Error('Usuario no encontrado')
      } else if (error.response?.status === 500) {
        throw new Error('Error interno del servidor')
      } else if (!error.response) {
        throw new Error('No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.')
      }
      
      throw new Error(error.response?.data?.message || 'Credenciales inválidas')
    }
  },

  /**
   * REGISTRAR NUEVO USUARIO
   * 
   * Crea una nueva cuenta de usuario en el backend de Spring Boot.
   * El backend se encarga de validar email único y encriptar contraseña.
   * 
   * @param {Object} userData - Datos del nuevo usuario
   * @param {string} userData.email - Email único del usuario
   * @param {string} userData.password - Contraseña del usuario
   * @param {string} userData.nombre - Nombre del usuario
   * @param {string} userData.apellido - Apellido del usuario (obligatorio)
   * @param {string} userData.username - Nombre de usuario único
   * @returns {Promise<Object>} Usuario creado
   * @throws {Error} Si el email ya está registrado o hay errores de validación
   */
  register: async (userData) => {
    try {
      console.log('📡 Enviando solicitud de registro a:', '/auth/register')
      console.log('📡 Datos enviados:', userData)
      
      const response = await api.post('/auth/register', userData)
      
      console.log('📡 Respuesta de registro:', {
        status: response.status,
        data: response.data
      })
      
      // Si el registro incluye un token automático, configurarlo
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
        console.log('🔐 Token configurado automáticamente tras registro')
      }
      
      return response.data
    } catch (error) {
      console.error('❌ Error en authAPI.register:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      
      // Mensajes específicos para registro
      if (error.response?.status === 400) {
        throw new Error(error.response?.data?.message || 'Datos de registro inválidos')
      } else if (error.response?.status === 409) {
        throw new Error('Este email ya está registrado')
      } else if (error.response?.status === 500) {
        throw new Error('Error interno del servidor')
      } else if (!error.response) {
        throw new Error('No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.')
      }
      
      throw new Error(error.response?.data?.message || 'Error al registrar usuario')
    }
  },

  /**
   * CERRAR SESIÓN
   * 
   * Limpia el token almacenado y la configuración de autorización.
   */
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete api.defaults.headers.common['Authorization']
  },

  /**
   * OBTENER USUARIO ACTUAL
   * 
   * Recupera los datos del usuario actualmente autenticado.
   * 
   * @returns {Promise<Object>} Usuario actual
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get('/usuarios/me')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener usuario')
    }
  },

  /**
   * OBTENER USUARIO POR ID
   * 
   * Recupera los datos de un usuario específico por su ID.
   * 
   * @param {number} id - ID único del usuario
   * @returns {Promise<Object>} Usuario
   */
  getUserById: async (id) => {
    try {
      const response = await api.get(`/usuarios/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener usuario')
    }
  },

  /**
   * ACTUALIZAR DATOS DE USUARIO
   * 
   * Actualiza la información del perfil de usuario.
   * 
   * @param {number} id - ID del usuario a actualizar
   * @param {Object} userData - Nuevos datos del usuario
   * @returns {Promise<Object>} Usuario actualizado
   */
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/usuarios/${id}`, userData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar usuario')
    }
  },

  /**
   * CAMBIAR CONTRASEÑA
   * 
   * Actualiza la contraseña de un usuario.
   * 
   * @param {number} id - ID del usuario
   * @param {string} currentPassword - Contraseña actual
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise<Object>} Respuesta del servidor
   */
  changePassword: async (id, currentPassword, newPassword) => {
    try {
      // Para cambio de contraseña, usar un endpoint específico si existe
      // Si no existe, usar PUT con los datos del usuario actualizados
      const response = await api.put(`/usuarios/${id}/password`, { 
        currentPassword, 
        newPassword 
      })
      return response.data
    } catch (error) {
      console.error('❌ Error al cambiar contraseña:', error)
      throw new Error(error.response?.data?.message || 'Error al cambiar contraseña')
    }
  }
}