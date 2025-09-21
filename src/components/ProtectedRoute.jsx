/**
 * COMPONENTE DE RUTA PROTEGIDA
 * 
 * Este componente protege rutas que requieren autenticación específica.
 * Redirige automáticamente al login si el usuario no está autenticado
 * o no tiene los permisos necesarios.
 * 
 * Tipos de protección:
 * - Rutas que requieren estar logueado (carrito, mi cuenta)
 * - Rutas que requieren ser administrador (gestión de productos)
 * - Redirección automática con estado preservado
 * 
 * Funcionalidades:
 * - Verificación de autenticación
 * - Verificación de roles (admin/usuario)
 * - Redirección inteligente con return URL
 * - Pantalla de carga durante verificación
 */

import { Navigate, useLocation } from 'react-router-dom'
import { useUser } from '../context/UserContext'

/**
 * COMPONENTE PROTECTEDROUTE
 * 
 * Envuelve componentes que requieren autenticación o permisos específicos.
 * 
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componente a proteger
 * @param {boolean} props.requireAuth - Si requiere estar autenticado
 * @param {boolean} props.requireAdmin - Si requiere ser administrador
 * @param {string} props.redirectTo - URL de redirección (default: '/login')
 */
export default function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  requireAdmin = false,
  redirectTo = '/login' 
}) {
  const { user, isAuthenticated, loading } = useUser()
  const location = useLocation()

  /**
   * ESTADO DE CARGA
   * Muestra spinner mientras se verifica la autenticación
   */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  /**
   * VERIFICACIÓN DE AUTENTICACIÓN
   * Si la ruta requiere autenticación y el usuario no está logueado
   */
  if (requireAuth && !isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ 
          from: location.pathname,
          message: 'Debes iniciar sesión para acceder a esta página' 
        }} 
        replace 
      />
    )
  }

  /**
   * VERIFICACIÓN DE PERMISOS DE ADMINISTRADOR
   * Si la ruta requiere ser admin y el usuario no tiene permisos
   */
  if (requireAdmin && (!user || user.role !== 'admin')) {
    return (
      <Navigate 
        to="/home" 
        state={{ 
          message: 'No tienes permisos para acceder a esta página',
          type: 'error'
        }} 
        replace 
      />
    )
  }

  /**
   * ACCESO AUTORIZADO
   * Si pasa todas las validaciones, mostrar el componente
   */
  return children
}