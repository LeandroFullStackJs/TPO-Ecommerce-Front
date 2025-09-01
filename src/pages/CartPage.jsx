import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/Modal'

export default function CartPage() {
  const { items, totals, removeFromCart, setQuantity, clearCart, canCheckout, checkout } = useCart()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useUser()
  const navigate = useNavigate()
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleCheckout = async () => {
    if (!user) {
      setShowLoginModal(true)
      return
    }
    try {
      setLoading(true)
      setError('')
      setSuccess('')

      if (!canCheckout()) {
        setError('No hay stock suficiente para algunos productos. Por favor, ajusta las cantidades.')
        return
      }

      await checkout()
      setSuccess('¡Compra realizada con éxito! El stock ha sido actualizado.')
    } catch (err) {
      setError(err.message || 'Error al procesar la compra')
    } finally {
      setLoading(false)
    }
  }
  const closeModal = () => setShowLoginModal(false)
  const goToLogin = () => navigate('/login')
  const handleQuantityChange = (id, newQuantity) => {
    try {
      setError('')
      setQuantity(id, newQuantity)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      clearCart()
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
            <Modal isOpen={showLoginModal} onClose={closeModal} onLogin={goToLogin} />
          </div>
        </div>
      )}
    </div>
  )
}

