/**
 * COMPONENTE NAVBAR - BARRA DE NAVEGACIÓN PRINCIPAL
 * 
 * Este componente renderiza la barra de navegación superior que está presente
 * en todas las páginas de la aplicación. Proporciona acceso rápido a todas
 * las secciones principales y adapta su contenido según el estado de autenticación.
 * 
 * Características principales:
 * - Navegación responsive a todas las secciones
 * - Menú hamburguesa para móviles
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
import { useState } from 'react'
import { useUser } from '../context/UserContext'
import { useCart } from '../context/CartContext'

/**
 * COMPONENTE NAVBAR
 * 
 * Barra de navegación principal que se adapta dinámicamente
 * al estado de autenticación del usuario y es completamente responsive.
 */
export default function Navbar() {
  // Obtener datos del usuario y funciones de autenticación
  const { user, isAuthenticated, logout } = useUser()
  
  // Obtener totales del carrito para mostrar contador
  const { totals } = useCart()
  
  // Hook para navegación programática
  const navigate = useNavigate()
  
  // Estado para controlar el menú móvil
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  // Estado para controlar el menú de usuario
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  /**
   * MANEJAR CIERRE DE SESIÓN
   * 
   * Ejecuta el logout del usuario y lo redirige a la página de login.
   * Limpia toda la información de sesión y estado de la aplicación.
   */
  const handleLogout = () => {
    logout()               // Ejecutar logout del UserContext
    setIsUserMenuOpen(false) // Cerrar menú de usuario
    navigate('/login')     // Redirigir al login
    setIsMobileMenuOpen(false) // Cerrar menú móvil
  }

  /**
   * TOGGLE MENÚ MÓVIL
   * 
   * Alterna la visibilidad del menú en dispositivos móviles
   */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  /**
   * CERRAR MENÚ MÓVIL
   * 
   * Cierra el menú móvil al hacer clic en un enlace
   */
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* LOGO/MARCA DE LA APLICACIÓN */}
        <Link to="/" className="navbar-brand">
          ArtGallery
        </Link>
        
        {/* BOTÓN HAMBURGUESA PARA MÓVILES */}
        <button 
          className="navbar-hamburger"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <span className={`hamburger-line ${isMobileMenuOpen ? 'hamburger-line-1-active' : ''}`}></span>
          <span className={`hamburger-line ${isMobileMenuOpen ? 'hamburger-line-2-active' : ''}`}></span>
          <span className={`hamburger-line ${isMobileMenuOpen ? 'hamburger-line-3-active' : ''}`}></span>
        </button>
        
        {/* OVERLAY PARA MÓVILES */}
        <div 
          className={`navbar-overlay ${isMobileMenuOpen ? 'navbar-overlay-active' : ''}`}
          onClick={closeMobileMenu}
        ></div>
        
        {/* MENÚ PRINCIPAL DE NAVEGACIÓN */}
        <div className={`navbar-menu ${isMobileMenuOpen ? 'navbar-menu-active' : ''}`}>
          {/* Enlaces principales disponibles para todos los usuarios */}
          <Link to="/home" className="navbar-link" onClick={closeMobileMenu}>
            Inicio
          </Link>
          <Link to="/artistas" className="navbar-link" onClick={closeMobileMenu}>
            Artistas
          </Link>
          <Link to="/categorias" className="navbar-link" onClick={closeMobileMenu}>
            Categorías
          </Link>
          
          {/* ENLACE AL CARRITO CON CONTADOR */}
          <Link to="/carrito" className="navbar-link cart-link" onClick={closeMobileMenu}>
            🛒 Carrito ({totals.count})
          </Link>
          
          {/* SECCIÓN DE AUTENTICACIÓN EN MÓVILES */}
          <div className="navbar-auth-mobile">
            {isAuthenticated ? (
              // MENÚ DE USUARIO AUTENTICADO
              <div className="user-menu-mobile">
                <span className="user-name-mobile">
                  Hola, {user.firstName}
                </span>
                <Link to="/mi-cuenta" className="navbar-link" onClick={closeMobileMenu}>
                  Mi Cuenta
                </Link>
                <Link to="/my-products" className="navbar-link" onClick={closeMobileMenu}>
                  Mis Obras
                </Link>
                <button onClick={handleLogout} className="btn btn-outline btn-sm">
                  Cerrar sesión
                </button>
              </div>
            ) : (
              // BOTONES PARA USUARIOS NO AUTENTICADOS
              <div className="auth-buttons-mobile">
                <Link to="/login" className="btn btn-outline btn-sm" onClick={closeMobileMenu}>
                  Iniciar sesión
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMobileMenu}>
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* SECCIÓN DE AUTENTICACIÓN PARA DESKTOP */}
        <div className="navbar-auth">
          {isAuthenticated ? (
            // MENÚ DE USUARIO AUTENTICADO
            <div 
              className="user-dropdown" 
              onMouseEnter={() => setIsUserMenuOpen(true)}
              onMouseLeave={() => setIsUserMenuOpen(false)}
            >
              <div className="user-dropdown-toggle">
                {user.firstName}
                <span className={`dropdown-arrow ${isUserMenuOpen ? 'open' : ''}`}>▼</span>
              </div>
              {isUserMenuOpen && (
                <div className="user-dropdown-menu">
                  <Link to="/mi-cuenta" onClick={() => setIsUserMenuOpen(false)}>Mi Cuenta</Link>
                  <Link to="/my-products" onClick={() => setIsUserMenuOpen(false)}>Mis Obras</Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout}>Cerrar sesión</button>
                </div>
              )}
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
