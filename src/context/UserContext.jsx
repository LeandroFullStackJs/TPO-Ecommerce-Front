"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { authAPI } from "../api/auth"

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Cargar usuario desde localStorage al inicializar
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem("user")
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error("Error al cargar usuario:", error)
        localStorage.removeItem("user")
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  // Función de login
  const login = async (email, password) => {
    try {
      setLoading(true)
      const userData = await authAPI.login(email, password)

      // Guardar en estado y localStorage
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))

      return userData
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Función de registro
  const register = async (userData) => {
    try {
      setLoading(true)
      const newUser = await authAPI.register(userData)

      // Guardar en estado y localStorage
      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))

      return newUser
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Función de logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  // Verificar si el usuario está autenticado
  const isAuthenticated = !!user

  // Verificar si el usuario es admin
  const isAdmin = user?.role === "admin"

  // Función para actualizar el usuario
  const updateUser = async (userData) => {
    try {
      setLoading(true)
      if (!user || !user.id) {
        throw new Error("Usuario no autenticado")
      }
      const updatedUserData = await authAPI.updateUser(user.id, userData)
      setUser(updatedUserData)
      localStorage.setItem("user", JSON.stringify(updatedUserData))
      return updatedUserData
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Función para cambiar la contraseña
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true)
      if (!user || !user.id) {
        throw new Error("Usuario no autenticado o ID no disponible para cambiar contraseña.")
      }
      await authAPI.changePassword(user.id, currentPassword, newPassword)
      return true
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
    updateUser,
    changePassword,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error("useUser debe usarse dentro de UserProvider")
  return ctx
}
