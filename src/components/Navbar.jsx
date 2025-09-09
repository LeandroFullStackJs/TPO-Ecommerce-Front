/**
 * COMPONENTE NAVBAR - BARRA DE NAVEGACIÓN PRINCIPAL
 * 
 * Este componente renderiza la barra de navegación superior que está presente
 * en todas las páginas de la aplicación. Proporciona acceso rápido a todas
 * las secciones principales y adapta su contenido según el estado de autenticación.
 * 
 * Características principales:
 * - Navegación responsive a todas las secciones
 * - Menú contextual según estado de autenticación
 * - Contador del carrito en tiempo real
 * - Acceso rápido a funcionalidades del usuario
 * 
 * Dependencias:
 * - UserContext: Para estado de autenticación y datos del usuario
 * - CartContext: Para mostrar contador de productos en el carrito
 * - React Router: Para navegación entre páginas
 */

import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useCart } from '../context/CartContext'

/**
 * COMPONENTE NAVBAR
 * 
 * Barra de navegación principal que se adapta dinámicamente
 * al estado de autenticación del usuario.
 */
export default function Navbar() {
  // Obtener datos del usuario y funciones de autenticación
  const { user, isAuthenticated, logout } = useUser()
  
  // Obtener totales del carrito para mostrar contador
  const { totals } = useCart()
  
  // Hook para navegación programática
  const navigate = useNavigate()

  /**
   * MANEJAR CIERRE DE SESIÓN
   * 
   * Ejecuta el logout del usuario y lo redirige a la página de login.
   * Limpia toda la información de sesión y estado de la aplicación.
   */
  const handleLogout = () => {
    logout()               // Ejecutar logout del UserContext
    navigate('/login')     // Redirigir al login
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* LOGO/MARCA DE LA APLICACIÓN */}
        <Link to="/" className="navbar-brand">
          ArtGallery
        </Link>
        
        {/* MENÚ PRINCIPAL DE NAVEGACIÓN */}
        <div className="navbar-menu">
          {/* Enlaces principales disponibles para todos los usuarios */}
          <Link to="/home" className="navbar-link">
            Inicio
          </Link>
          <Link to="/catalogo" className="navbar-link">
            Catálogo
          </Link>
          <Link to="/artistas" className="navbar-link">
            Artistas
          </Link>
          <Link to="/categorias" className="navbar-link">
            Categorías
          </Link>
          
          {/* ENLACES SOLO PARA USUARIOS AUTENTICADOS */}
          {isAuthenticated && (
            <Link to="/my-products" className="navbar-link">
              Mis Obras
            </Link>
          )}

          {isAuthenticated && (
            <Link to="/mi-cuenta" className="navbar-link">
              Mi Cuenta
            </Link>
          )}
          
          {/* ENLACE AL CARRITO CON CONTADOR */}
          <Link to="/carrito" className="navbar-link cart-link">
            🛒 Carrito ({totals.count})
          </Link>
        </div>

        {/* SECCIÓN DE AUTENTICACIÓN */}
        <div className="navbar-auth">
          {isAuthenticated ? (
            // MENÚ DE USUARIO AUTENTICADO
            <div className="user-menu">
              <span className="user-name">
                Hola, {user.firstName}
              </span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Cerrar sesión
              </button>
            </div>
          ) : (
            // BOTONES PARA USUARIOS NO AUTENTICADOS
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline btn-sm">
                Iniciar sesión
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
