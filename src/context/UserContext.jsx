/**
 * CONTEXTO DE USUARIO - GESTIÓN DE AUTENTICACIÓN Y SESIONES
 * 
 * Este contexto maneja todo lo relacionado con la autenticación del usuario:
 * - Estado de autenticación (logueado/no logueado)
 * - Datos del usuario actual
 * - Persistencia de sesión en localStorage
 * - Funciones de login, logout y registro
 * 
 * Funcionalidades principales:
 * - Autenticación automática al cargar la página
 * - Almacenamiento persistente de datos de usuario
 * - Verificación de estado de autenticación
 * - Limpieza de datos al cerrar sesión
 */

"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { authAPI } from "../api/auth"

// Crear el contexto de usuario
const UserContext = createContext(null)

export function UserProvider({ children }) {
  // Estados del contexto
  const [user, setUser] = useState(null)           // Datos del usuario actual
  const [loading, setLoading] = useState(true)     // Estado de carga inicial

  /**
   * EFECTO DE INICIALIZACIÓN - PERSISTENCIA DE SESIÓN
   * 
   * Este useEffect se ejecuta UNA SOLA VEZ al montar el componente.
   * Su propósito es verificar si hay una sesión guardada en localStorage
   * y restaurar automáticamente el estado del usuario.
   * 
   * Casos de uso:
   * - Usuario cierra y abre el navegador
   * - Usuario recarga la página (F5)
   * - Usuario navega a otra pestaña y vuelve
   */
  useEffect(() => {
    const loadUser = () => {
      try {
        // Intentar obtener datos del usuario desde localStorage
        const savedUser = localStorage.getItem("user")
        
        if (savedUser) {
          // JSON.parse: Convertir string JSON de vuelta a objeto JavaScript
          const userData = JSON.parse(savedUser)
          
          // Restaurar el estado del usuario en el contexto
          setUser(userData)
          
          // En este punto el usuario está "automáticamente logueado"
        }
        // Si no hay datos guardados, el usuario permanece como null (no logueado)
        
      } catch (error) {
        // Error de parsing: datos corruptos en localStorage
        console.error("Error al cargar usuario:", error)
        
        // Limpiar datos corruptos para evitar problemas futuros
        localStorage.removeItem("user")
        
        // Asegurar que user sea null si hay error
        setUser(null)
        
      } finally {
        // SIEMPRE ejecutar esto, haya error o no
        // Terminar el estado de carga inicial
        setLoading(false)
      }
    }

    // Ejecutar la función de carga
    loadUser()
    
  }, []) // Array vacío: solo se ejecuta al montar el componente

  /**
   * FUNCIÓN DE INICIO DE SESIÓN - AUTENTICACIÓN
   * 
   * Proceso completo de autenticación del usuario:
   * 1. Envía credenciales al servidor
   * 2. Recibe y valida respuesta
   * 3. Guarda datos en estado y localStorage
   * 4. Actualiza estado de autenticación
   * 
   * @param {string} email - Email/username del usuario
   * @param {string} password - Contraseña en texto plano (se encripta en el servidor)
   * @returns {Object} Datos del usuario autenticado
   * @throws {Error} Error de autenticación (credenciales inválidas, servidor, etc.)
   */
  const login = async (email, password) => {
    try {
      // Activar indicador de carga para UI (spinner, botón disabled, etc.)
      setLoading(true)
      
      console.log('🔑 Intentando login con:', { email, password: '***' })
      
      // LLAMADA A LA API: Enviar credenciales al backend
      // authAPI.login hace POST a /auth/login con email y password
      const response = await authAPI.login(email, password)

      console.log('✅ Respuesta del login:', response)

      // ÉXITO: El servidor respondió con datos válidos del usuario
      
      // El backend puede devolver la estructura de diferentes formas
      // Normalizamos la respuesta para asegurar compatibilidad
      const userData = response.user || response.data || response
      
      // Normalizar campos de nombre del backend (español) al frontend (inglés)
      if (userData) {
        if (userData.nombre && !userData.firstName) {
          userData.firstName = userData.nombre
        }
        if (userData.apellido && !userData.lastName) {
          userData.lastName = userData.apellido
        }
      }
      
      // Normalizar el rol para compatibilidad con diferentes formatos del backend
      if (userData) {
        // Si el rol viene como 'rol' (español), copiarlo a 'role' (inglés)
        if (userData.rol && !userData.role) {
          userData.role = userData.rol
        }
        
        // Normalizar valores de rol a minúsculas
        if (userData.role && typeof userData.role === 'string') {
          userData.role = userData.role.toLowerCase()
        }
        
        // Si el rol viene en authorities array (Spring Security)
        if (userData.authorities && Array.isArray(userData.authorities)) {
          const adminAuthority = userData.authorities.find(auth => 
            auth.authority?.toLowerCase().includes('admin') ||
            auth.role?.toLowerCase().includes('admin')
          )
          if (adminAuthority) {
            userData.role = 'admin'
          }
        }
      }
      
      // Verificar que tenemos datos válidos del usuario
      if (!userData || !userData.email) {
        throw new Error('Respuesta inválida del servidor')
      }
      
      // 1. Actualizar estado global del contexto
      setUser(userData)
      
      // 2. Persistir datos en localStorage para mantener sesión
      // JSON.stringify: Convertir objeto a string para almacenamiento
      localStorage.setItem("user", JSON.stringify(userData))

      // 3. Si hay token, también almacenarlo separadamente
      if (response.token) {
        localStorage.setItem("token", response.token)
        console.log('🔐 Token almacenado correctamente')
      }

      console.log('✅ Login exitoso, usuario:', userData.email)

      // 4. Retornar datos para que el componente pueda usarlos
      return userData
      
    } catch (error) {
      // ERROR: Credenciales inválidas, servidor caído, red, etc.
      console.error('❌ Error en login:', error.message)
      
      // No manejar el error aquí, dejarlo para el componente
      // Esto permite mostrar mensajes específicos en la UI
      throw error
      
    } finally {
      // SIEMPRE ejecutar: haya éxito o error
      // Desactivar indicador de carga
      setLoading(false)
    }
  }

  /**
   * FUNCIÓN DE REGISTRO DE NUEVO USUARIO
   * Registra un nuevo usuario en el sistema.
   * 
   * @param {Object} userData - Datos del usuario a registrar
   * @returns {Object} Datos del usuario registrado
   * @throws {Error} Error de registro
   */
  const register = async (userData) => {
    try {
      setLoading(true)
      
      console.log('📝 Iniciando registro con datos:', userData)
      
      // Mapear datos del frontend al formato esperado por el backend Spring Boot
      const backendUserData = {
        email: userData.email,
        password: userData.password,
        nombre: userData.firstName || userData.username || 'Usuario',
        apellido: userData.lastName || userData.username || 'Apellido',
        username: userData.username || userData.email?.split('@')[0] || 'user'
      }
      
      console.log('🔄 Datos mapeados para backend:', backendUserData)
      
      // Llamar a la API de registro
      const response = await authAPI.register(backendUserData)

      console.log('✅ Usuario registrado exitosamente:', response)

      // Hacer login automático después del registro exitoso
      await login(userData.email, userData.password)

      // El backend puede devolver la estructura de diferentes formas
      const newUser = response.user || response.data || response

      return newUser
    } catch (error) {
      console.error('❌ Error en registro:', error.message)
      // Propagar el error para manejo en el componente
      throw error
    } finally {
      // Desactivar estado de carga
      setLoading(false)
    }
  }
  
  /**
   * FUNCIÓN DE CIERRE DE SESIÓN
   * Limpia todos los datos del usuario y cierra la sesión.
   */
  const logout = () => {
    // Limpiar el estado del usuario
    setUser(null)
    // Remover datos persistentes del localStorage
    localStorage.removeItem("user")
  }

  /**
   * VERIFICADOR DE AUTENTICACIÓN
   * Retorna true si hay un usuario autenticado, false en caso contrario.
   * Utiliza el operador !! para convertir a boolean.
   */
  const isAuthenticated = !!user

  /**
   * VERIFICADOR DE PERMISOS DE ADMINISTRADOR
   * Determina si el usuario actual tiene permisos administrativos.
   * 
   * @returns {boolean} true si el usuario es administrador
   */
  const isAdmin = user?.role === "admin"

  // Función para actualizar el usuario
  /**
   * FUNCIÓN DE ACTUALIZACIÓN DE DATOS DE USUARIO
   * Permite actualizar la información del perfil del usuario.
   * 
   * @param {Object} userData - Nuevos datos del usuario
   * @returns {Object} Datos actualizados del usuario
   * @throws {Error} Error si no hay usuario autenticado o falla la actualización
   */
  const updateUser = async (userData) => {
    try {
      setLoading(true)
      
      // Verificar que hay un usuario autenticado
      if (!user || !user.id) {
        throw new Error("Usuario no autenticado")
      }
      
      // Mapear campos del frontend (inglés) al backend (español)
      const backendUserData = {
        nombre: userData.firstName || userData.nombre,
        apellido: userData.lastName || userData.apellido,
        email: userData.email
      }
      
      console.log('📝 Actualizando usuario con datos:', backendUserData)
      
      // Llamar a la API para actualizar los datos
      const updatedUserData = await authAPI.updateUser(user.id, backendUserData)
      
      // Normalizar la respuesta del backend para el frontend
      const normalizedUserData = {
        ...updatedUserData,
        firstName: updatedUserData.nombre,
        lastName: updatedUserData.apellido
      }
      
      // Actualizar el estado local y persistente
      setUser(normalizedUserData)
      localStorage.setItem("user", JSON.stringify(normalizedUserData))
      
      return normalizedUserData
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  /**
   * FUNCIÓN DE CAMBIO DE CONTRASEÑA
   * Permite al usuario cambiar su contraseña actual.
   * 
   * @param {string} currentPassword - Contraseña actual
   * @param {string} newPassword - Nueva contraseña
   * @returns {boolean} true si el cambio fue exitoso
   * @throws {Error} Error si no hay usuario o falla el cambio
   */
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true)
      
      // Verificar autenticación
      if (!user || !user.id) {
        throw new Error("Usuario no autenticado o ID no disponible para cambiar contraseña.")
      }
      
      // Llamar a la API para cambiar la contraseña
      await authAPI.changePassword(user.id, currentPassword, newPassword)
      return true
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  /**
   * VALOR DEL CONTEXTO
   * Objeto que contiene todos los estados y funciones disponibles
   * para los componentes que consuman este contexto.
   */
  const value = {
    user,                // Datos del usuario actual
    loading,             // Estado de carga
    login,               // Función de inicio de sesión
    register,            // Función de registro
    logout,              // Función de cierre de sesión
    isAuthenticated,     // Estado de autenticación
    isAdmin,             // Permisos de administrador
    updateUser,          // Actualización de perfil
    changePassword,      // Cambio de contraseña
  }

  // Proveer el contexto a los componentes hijos
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

/**
 * HOOK PERSONALIZADO PARA USAR EL CONTEXTO DE USUARIO
 * 
 * Este hook facilita el acceso al contexto de usuario desde cualquier componente.
 * Incluye validación para asegurar que se use dentro del UserProvider.
 * 
 * @returns {Object} Contexto de usuario con todos los estados y funciones
 * @throws {Error} Si se usa fuera del UserProvider
 */
export function useUser() {
  const ctx = useContext(UserContext)
  
  // Validar que el hook se use dentro del proveedor correcto
  if (!ctx) {
    throw new Error("useUser debe usarse dentro de UserProvider")
  }
  
  return ctx
}
