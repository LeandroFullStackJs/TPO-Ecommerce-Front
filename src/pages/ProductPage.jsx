import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import { useCart } from '../context/CartContext'
import { useUser  } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/Modal'

export default function ProductPage() {
  const { id } = useParams()
  const { products, loading } = useProducts()
  const { addToCart, canAddToCart } = useCart()
  const product = useMemo(() => products.find(p => p.id === id), [id, products])
  const [qty, setQty] = useState(1)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [imageError, setImageError] = useState(false)
  const { user } = useUser()
  const navigate = useNavigate()
  const [showLoginModal, setShowLoginModal] = useState(false) 
  const handleImageError = () => {
    setImageError(true)
  }

  // Imagen de respaldo para obras de arte
  const fallbackImage = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&crop=center'

  if (loading) {
    return (
      <div className="section">
        <div className="section-header">
          <h1 className="section-title">Cargando producto...</h1>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="section">
        <div className="section-header">
          <h1 className="section-title">Obra no encontrada</h1>
          <p className="section-subtitle">
            La obra que buscas no existe o ha sido vendida
          </p>
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/catalogo" className="btn btn-primary">
            Volver a la galería
          </Link>
        </div>
      </div>
    )
  }

  const hasStock = product.stock > 0
  const canAdd = hasStock && canAddToCart(product, qty)

  const handleAddToCart = () => {
    if (!user) {
      setShowLoginModal(true)
      return
    }
    try {
      setError('')
      setSuccess('')
      addToCart(product, qty)
      setSuccess(`¡${qty} unidad(es) agregada(s) al carrito!`)
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError(error.message)
      setTimeout(() => setError(''), 5000)
    }
  }

  const handleQuantityChange = (newQty) => {
    setError('')
    setSuccess('')
    if (newQty > 0 && newQty <= product.stock) {
      setQty(newQty)
    }
  }

  const closeModal = () => setShowLoginModal(false)
  const goToLogin = () => navigate('/login')

  const getStockStatus = () => {
    if (product.stock === 0) return 'out'
    if (product.stock < 5) return 'low'
    return 'good'
  }

  const getStockText = () => {
    if (product.stock === 0) return 'Sin stock'
    if (product.stock === 1) return 'Última unidad'
    if (product.stock < 5) return `Últimas ${product.stock} unidades`
    return `${product.stock} disponibles`
  }

  return (
    <div className="section">
      {/* Breadcrumb */}
      <div style={{ marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
        <Link to="/" style={{ color: 'var(--text-light)' }}>Inicio</Link> / 
        <Link to="/catalogo" style={{ color: 'var(--text-light)', margin: '0 0.5rem' }}>Galería</Link> / 
        <span style={{ color: 'var(--text-color)' }}>{product.name}</span>
      </div>

      <div className="product-detail">
        <div className="product-detail-image-container">
          <img 
            src={imageError ? fallbackImage : product.image} 
            alt={"product.name"} 
            className="product-detail-image"
            onError={handleImageError}
          />
        </div>
        
        <div className="product-detail-info">
          
          
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            lineHeight: '1.2',
            marginBottom: '1rem',
            color: 'var(--text-color)'
          }}>
            {product.name}
          </h1>
          
          <p className="brand">
            {"by " + product.artist}
          </p>
          
          <p className="category" style={{ 
            fontSize: '1rem',
            color: 'var(--text-light)',
            marginBottom: '1rem'
          }}>
            Categoría: {product.category}
          </p>

          <div className="price" style={{ 
            fontSize: '2.5rem', 
            marginBottom: '1.5rem'
          }}>
            <span style={{ fontSize: '0.7em', marginRight: '0.25rem' }}></span>
            {"$ " + product.price.toLocaleString('es-AR')}
          </div>

          <div className="stock">
            <span className={`stock-dot ${getStockStatus()}`}></span>
            {getStockText()}
          </div>
          
          <p className="description">
            {product.description}
          </p>


          <div style={{ 
            marginBottom: '2rem',
            padding: '1.5rem',
            background: 'var(--light-gray)',
            borderRadius: 'var(--border-radius)',
          }}>
            <div style={{fontSize: '1rem'}}>
              <div>
                <strong>Dimensiones</strong> 
                <p>{product.dimensions}</p>
              </div>
              <div>
                <strong>Año:</strong> 
                <p>{product.year}</p>
              </div>
              <div>
                <strong>Técnica</strong> 
               <p>{product.technique}</p>
              </div>
            </div>
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

          <div className="buy-section" style={{
            padding: '2rem',
            background: 'var(--light-gray)',
            borderRadius: 'var(--border-radius)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Cantidad:</label>
              <input 
                type="number" 
                min="1" 
                max={product.stock} 
                value={qty} 
                onChange={e => handleQuantityChange(Number(e.target.value))}
                disabled={!hasStock}
                style={{
                  width: '80px',
                  padding: '0.75rem',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--border-radius)',
                  textAlign: 'center',
                  fontSize: '1rem'
                }}
              />
            </div>
            
            <button 
              onClick={handleAddToCart}
              disabled={!canAdd}
              className={`btn ${canAdd ? 'btn-primary' : 'btn-secondary'} btn-lg`}
              style={{ flex: 1, textTransform: 'uppercase', letterSpacing: '0.15em'}}
            >
              {hasStock ? 'Añadir al Carrito' : 'No disponible'}
            </button>

              
            <button
              onClick={'handleAddToWhishlist'}
              className={'btn btn-primary btn-lg'}
              style={{flex: 1, textTransform: 'uppercase', letterSpacing: '0.15em'}}
            >
              Añadir a Favoritos
            </button>
          </div>
        </div>

        <div style={{ 
            display: 'flex', 
            gap: '1rem',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '2rem'
          }}>
            <Link to="/catalogo" className="btn btn-outline">
              ← Seguir explorando
            </Link>
            <Modal isOpen={showLoginModal} onClose={closeModal} onLogin={goToLogin} />
        </div>
      </div>
    </div>
    
  )
}

