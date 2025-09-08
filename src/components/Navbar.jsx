import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useUser()
  const { totals } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          ArtGallery
        </Link>
        
        <div className="navbar-menu">
          <Link to="/home" className="navbar-link">
            Inicio
          </Link>
          <Link to="/catalogo" className="navbar-link">
            Catálogo
          </Link>

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
          
          <Link to="/carrito" className="navbar-link cart-link">
            🛒 Carrito ({totals.count})
          </Link>
        </div>

        <div className="navbar-auth">
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-name">
                Hola, {user.firstName}
              </span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Cerrar sesión
              </button>
            </div>
          ) : (
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
