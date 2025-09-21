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
  baseURL: 'http://localhost:5000',        // URL del backend en desarrollo
  timeout: 10000,                          // Timeout de 10 segundos
  headers: {
    'Content-Type': 'application/json'     // Content-Type por defecto
  }
})

/**
 * INTERCEPTOR DE RESPUESTAS
 * 
 * Maneja automáticamente los errores comunes de la API:
 * - Errores de autenticación (401)
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
      window.location.href = '/login'
    }
    
    // Propagar el error para manejo específico en componentes
    return Promise.reject(error) // Necesario para que los componentes puedan capturar errores con try/catch
  }
)

// Exportar la instancia configurada para uso en toda la aplicación
export default api // Exportación por defecto de la instancia configurada de axios
