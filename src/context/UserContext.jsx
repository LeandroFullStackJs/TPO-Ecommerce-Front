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
   * EFECTO DE INICIALIZACIÓN
   * Carga los datos del usuario desde localStorage al montar el componente.
   * Esto permite mantener la sesión activa entre recargas de página.
   */
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem("user")
        if (savedUser) {
          // Parsear y establecer los datos del usuario guardados
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error("Error al cargar usuario:", error)
        // Si hay error al parsear, limpiar el localStorage
        localStorage.removeItem("user")
      } finally {
        // Siempre terminar el estado de carga
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  /**
   * FUNCIÓN DE INICIO DE SESIÓN
   * Autentica al usuario con email y contraseña.
   * 
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Object} Datos del usuario autenticado
   * @throws {Error} Error de autenticación
   */
  const login = async (email, password) => {
    try {
      // Activar estado de carga durante la autenticación
      setLoading(true)
      
      // Llamar a la API de autenticación
      const userData = await authAPI.login(email, password)

      // Guardar datos del usuario en el estado y localStorage
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))

      return userData
    } catch (error) {
      // Propagar el error para que lo maneje el componente que llama
      throw error
    } finally {
      // Siempre desactivar el estado de carga
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
      
      // Llamar a la API de registro
      const newUser = await authAPI.register(userData)

      // Guardar datos del nuevo usuario en el estado y localStorage
      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))

      return newUser
    } catch (error) {
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
      
      // Llamar a la API para actualizar los datos
      const updatedUserData = await authAPI.updateUser(user.id, userData)
      
      // Actualizar el estado local y persistente
      setUser(updatedUserData)
      localStorage.setItem("user", JSON.stringify(updatedUserData))
      
      return updatedUserData
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
