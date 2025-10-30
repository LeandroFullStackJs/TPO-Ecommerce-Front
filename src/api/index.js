/**
 * CONFIGURACIÓN CENTRAL DE LA API
 * 
 * Este archivo configura la instancia principal de Axios para todas las
 * comunicaciones HTTP con el backend. Centraliza la configuración y
 * manejo de errores para mantener consistencia en toda la aplicación.
 * 
 * Características:
 * - URL base configurable para diferentes entornos
 * - Timeout para evitar requests colgados
 * - Headers por defecto para todas las peticiones
 * - Interceptores para manejo automático de errores
 * - Redirección automática en caso de falta de autorización
 * 
 * Patrón de diseño: Singleton para instancia de API
 * Beneficios: Configuración centralizada, fácil mantenimiento y debugging
 */

import axios from 'axios'

/**
 * INSTANCIA PRINCIPAL DE AXIOS
 * 
 * Configuración base para todas las peticiones HTTP de la aplicación.
 * Incluye URL del servidor, timeout y headers por defecto.
 */
const api = axios.create({
  baseURL: '/api',                         // URL relativa para usar proxy de Vite
  timeout: 10000,                          // Timeout de 10 segundos
  headers: {
    'Content-Type': 'application/json'     // Content-Type por defecto
  }
})

/**
 * INTERCEPTOR DE PETICIONES
 * 
 * Añade automáticamente el token de autenticación a todas las peticiones
 * si está disponible en localStorage.
 */
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * INTERCEPTOR DE RESPUESTAS
 * 
 * Maneja automáticamente los errores comunes de la API:
 * - Errores de autenticación (401)
 * - Errores de autorización (403)
 * - Errores de red y timeout
 * - Logging centralizado de errores
 */
api.interceptors.response.use(
  response => response,  // Pasar respuestas exitosas sin modificar
  error => {
    console.error('API Error:', error)
    
    // Manejo específico de error de autenticación
    if (error.response?.status === 401) {
      // Limpiar datos de usuario y redirigir al login
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
      window.location.href = '/login'
    }
    
    // Manejo específico de error de autorización
    if (error.response?.status === 403) {
      console.warn('Acceso denegado (403):', error.config?.url)
      // No redirigir automáticamente para 403, dejar que el componente maneje
    }
    
    // Propagar el error para manejo específico en componentes
    return Promise.reject(error) // Necesario para que los componentes puedan capturar errores con try/catch
  }
)

// Configurar token al inicializar si existe en localStorage
const token = localStorage.getItem('token')
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// Exportar la instancia configurada para uso en toda la aplicación
export default api // Exportación por defecto de la instancia configurada de axios
