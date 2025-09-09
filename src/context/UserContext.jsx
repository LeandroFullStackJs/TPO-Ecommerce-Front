import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api/auth'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Cargar usuario desde localStorage al inicializar
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error('Error al cargar usuario:', error)
        localStorage.removeItem('user')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  // Función de login, pasamos parametros base
  const login = async (email, password) => {
    try {
      //cambiamos el estado null -> true
      setLoading(true)
      //llamamos a la api (authAPI.login y le pasamos los parametros)
      const userData = await authAPI.login(email, password)
      
      // Guardar en estado y localStorage
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      
      return userData
    } catch (error) {
      throw error
    } finally {
      //algo fallo, por lo q no se cambio el estado
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
      localStorage.setItem('user', JSON.stringify(newUser))
      
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
    localStorage.removeItem('user')
  }

  // Verificar si el usuario está autenticado
  //true - si hay un usuario logeado, null en caso contrario
  const isAuthenticated = !!user

  // Verificar si el usuario es admin,true - si es admin, null en caso contrario
  const isAdmin = user?.role === 'admin'

  // Valores y funciones que estarán disponibles en el contexto (cuando usemos useUser)
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser debe usarse dentro de UserProvider')
  return ctx
}
