import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext' // Teoría: Hook de Contexto para acceder al estado y funciones del carrito.
import { useUser } from '../context/UserContext' // Teoría: Hook de Contexto para acceder al estado del usuario (autenticación).
import { useNavigate } from 'react-router-dom' // Teoría: Hook para la navegación programática.
import Modal from '../components/Modal' // Teoría: Importación del componente Modal para la interacción de inicio de sesión.

export default function CartPage() {
  // Teoría: Desestructuración de Contextos
  // Se obtienen las propiedades y funciones necesarias de los contextos CartContext y UserContext.
  const { items, totals, removeFromCart, setQuantity, clearCart, canCheckout, checkout } = useCart()
  const [error, setError] = useState('') // Estado para mensajes de error.
  const [success, setSuccess] = useState('') // Estado para mensajes de éxito.
  const [loading, setLoading] = useState(false) // Estado para indicar si una operación está en curso.
  const { user } = useUser() // Obtiene el objeto de usuario del contexto.
  const navigate = useNavigate() // Función para navegar a otras rutas.
  const [showLoginModal, setShowLoginModal] = useState(false) // Estado para controlar la visibilidad del modal de inicio de sesión.

  // Funcionamiento: Manejo del proceso de checkout
  // Esta función se ejecuta cuando el usuario intenta finalizar la compra.
  const handleCheckout = async () => {
    // Teoría: Protección de Ruta / Autenticación
    // Si el usuario no está logueado, se muestra un modal pidiéndole que inicie sesión.
    if (!user) {
      setShowLoginModal(true)
      return
    }
    try {
      setLoading(true) // Activa el estado de carga.
      setError('') // Limpia mensajes de error previos.
      setSuccess('') // Limpia mensajes de éxito previos.

      // Teoría: Validación de Stock
      // Antes de proceder, se verifica si hay suficiente stock para todos los productos en el carrito.
      if (!canCheckout()) {
        setError('No hay stock suficiente para algunos productos. Por favor, ajusta las cantidades.')
        return
      }

      // Funcionamiento: Ejecución del checkout
      // Llama a la función 'checkout' del CartContext, que maneja la lógica de descuento de stock y limpieza del carrito.
      await checkout()
      setSuccess('¡Compra realizada con éxito! El stock ha sido actualizado.') // Muestra mensaje de éxito.
    } catch (err) {
      setError(err.message || 'Error al procesar la compra') // Captura y muestra errores.
    } finally {
      setLoading(false) // Desactiva el estado de carga.
    }
  }

  // Funcionamiento: Funciones para el modal
  const closeModal = () => setShowLoginModal(false) // Cierra el modal.
  const goToLogin = () => navigate('/login') // Navega a la página de login.

  // Funcionamiento: Manejo del cambio de cantidad de un producto
  // Actualiza la cantidad de un producto en el carrito, con validación de stock.
  const handleQuantityChange = (id, newQuantity) => {
    try {
      setError('') // Limpia errores.
      setQuantity(id, newQuantity) // Llama a la función 'setQuantity' del CartContext.
    } catch (err) {
      setError(err.message) // Muestra error si no hay stock suficiente.
    }
  }

  // Funcionamiento: Vaciar el carrito
  // Pide confirmación al usuario antes de limpiar completamente el carrito.
  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      clearCart() // Llama a la función 'clearCart' del CartContext.
    }
  }

  return (
    <div className="section">
      <div className="section-header">
        <h1 className="section-title">Carrito de Compras</h1>
        <p className="section-subtitle">
          Revisa tus productos antes de finalizar la compra
        </p>
      </div>
      
      {/* Funcionamiento: Renderizado condicional de mensajes de error y éxito */}
      {error && (
        <div className="error-message" style={{
          color: '#e74c3c',
          padding: '1rem',
          margin: '1rem 0',
          backgroundColor: '#fdf2f2',
          borderRadius: 'var(--border-radius)',
          border: '1px solid #fecaca'
        }}>
          {error}
        </div>
      )}
      
      {success && (
        <div className="success-message" style={{
          color: '#27ae60',
          padding: '1rem',
          margin: '1rem 0',
          backgroundColor: '#f0f9f4',
          borderRadius: 'var(--border-radius)',
          border: '1px solid #a7f3d0'
        }}>
          {success}
        </div>
      )}

      {/* Teoría: Renderizado Condicional (Carrito Vacío vs. Carrito con Items) */}
      {/* Si no hay items en el carrito, se muestra un mensaje de carrito vacío. */}
      {items.length === 0 ? (
        <div className="empty-cart">
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'var(--light-gray)',
            borderRadius: 'var(--border-radius)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-color)' }}>
              Tu carrito está vacío
            </h3>
            <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
              ¡Descubre nuestras obras de arte y agrega algunas al carrito!
            </p>
            <Link to="/catalogo" className="btn btn-primary btn-lg">
              Explorar Obras de Arte
            </Link>
          </div>
        </div>
      ) : (
        // Funcionamiento: Vista del carrito con items
        <div className="cart-container">
          <div className="cart-items">
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '2rem'
            }}>
              <h3>Obras en el carrito ({totals.count})</h3>
              <button 
                onClick={handleClearCart}
                className="btn btn-outline btn-sm"
              >
                🗑️ Vaciar carrito
              </button>
            </div>
            
            {/* Funcionamiento: Mapeo de items del carrito */}
            {/* Se itera sobre cada item en el array 'items' del carrito para renderizar su información. */}
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p className="brand">{item.artist}</p>
                  <p className="price">
                    <span style={{ fontSize: '0.8em', marginRight: '0.25rem' }}>$</span>
                    {item.price.toLocaleString('es-AR')}
                  </p>
                  <small style={{ color: 'var(--text-light)' }}>
                    {item.dimensions} • {item.technique}
                  </small>
                </div>
                <div className="cart-item-quantity">
                  <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Cantidad:</label>
                  {/* Funcionamiento: Input de cantidad controlada */}
                  {/* El valor del input está vinculado a 'item.quantity' y 'onChange' llama a 'handleQuantityChange'. */}
                  {/* 'max={item.stock}' asegura que el usuario no pueda seleccionar una cantidad mayor al stock disponible. */}
                  <input 
                    type="number" 
                    min="1" 
                    max={item.stock} 
                    value={item.quantity} 
                    onChange={e => handleQuantityChange(item.id, Number(e.target.value))}
                    style={{
                      width: '70px',
                      padding: '0.5rem',
                      border: '2px solid var(--border-color)',
                      borderRadius: 'var(--border-radius)',
                      textAlign: 'center'
                    }}
                  />
                </div>
                <div className="cart-item-total">
                  <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                    ${(item.price * item.quantity).toLocaleString('es-AR')}
                  </div>
                  {/* Funcionamiento: Botón para quitar item */}
                  {/* Llama a 'removeFromCart' del CartContext para eliminar el producto. */}
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="btn btn-danger btn-sm"
                    style={{ marginTop: '0.5rem' }}
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Funcionamiento: Resumen de la compra */}
          {/* Muestra el subtotal, IVA y total, calculados por el CartContext. */}
          <div className="cart-summary">
            <h3 style={{ marginBottom: '1.5rem' }}>Resumen de la compra</h3>
            
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal ({totals.count} obra{totals.count !== 1 ? 's' : ''}):</span>
                <span>${totals.subtotal.toLocaleString('es-AR')}</span>
              </div>
              <div className="summary-row">
                <span>IVA (21%):</span>
                <span>${totals.iva.toLocaleString('es-AR')}</span>
              </div>
              <div className="summary-row summary-total">
                <span>Total:</span>
                <span>${totals.total.toLocaleString('es-AR')}</span>
              </div>
            </div>
            
            {/* Funcionamiento: Botón de finalizar compra */}
            {/* Deshabilitado si no se puede hacer checkout (por stock) o si está cargando. */}
            {/* Al hacer clic, llama a 'handleCheckout'. */}
            <button 
              className="btn btn-primary btn-full btn-lg"
              onClick={handleCheckout}
              disabled={!canCheckout() || loading}
              style={{ marginTop: '1.5rem' }}
            >
              {loading ? 'Procesando...' : '🎨 Finalizar compra'}
            </button>
            
            <Link 
              to="/catalogo"
              className="btn btn-outline btn-full"
              style={{ marginTop: '1rem' }}
            >
              ← Seguir explorando
            </Link>
            {/* Funcionamiento: Modal de inicio de sesión */}
            {/* Se renderiza condicionalmente si 'showLoginModal' es true. */}
            <Modal isOpen={showLoginModal} onClose={closeModal} onLogin={goToLogin} />
          </div>
        </div>
      )}
    </div>
  )
}