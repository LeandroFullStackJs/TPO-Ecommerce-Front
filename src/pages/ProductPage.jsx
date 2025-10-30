/**
 * PÁGINA DE DETALLE DE PRODUCTO - VISTA INDIVIDUAL DE OBRA DE ARTE
 * 
 * Esta página muestra información completa de una obra de arte específica,
 * permitiendo al usuario ver todos los detalles, agregar al carrito y gestionar wishlist.
 * 
 * Funcionalidades principales:
 * - Visualización detallada de la obra (imagen, información, precio)
 * - Selector de cantidad y validación de stock
 * - Integración con carrito de compras
 * - Gestión de wishlist (agregar/quitar favoritos)
 * - Navegación a perfil del artista
 * - Manejo de errores de carga y estados de loading
 * 
 * Dependencias:
 * - ProductContext: Para obtener datos del producto
 * - CartContext: Para agregar productos al carrito
 * - UserContext: Para validar autenticación
 * - WishlistContext: Para gestionar productos favoritos
 */

import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import { useCart } from '../context/CartContext'
import { useUser  } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/Modal'
import { useWishlist } from '../context/WishlistContext'

export default function ProductPage() {
  // Obtener ID del producto desde la URL
  const { id } = useParams()
  
  // Hooks de contextos para acceder a datos y funcionalidades
  const { products, loading } = useProducts()
  const { addToCart, canAddToCart } = useCart()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const { user, isAuthenticated } = useUser()
  const navigate = useNavigate()

  /**
   * MEMOIZACIÓN DEL PRODUCTO ACTUAL
   * 
   * Usa useMemo para evitar recálculos innecesarios del producto actual.
   * Solo recalcula cuando cambia el ID de la URL o el array de productos,
   * optimizando el rendimiento al evitar búsquedas repetitivas.
   * 
   * Nota: Convertimos id a número para comparar correctamente con IDs del backend
   */
  const product = useMemo(() => {
    const productId = parseInt(id, 10) // Convertir string a número
    return products.find(p => p.id === productId || p.id === id) // Buscar por ID numérico o string
  }, [id, products])
  
  // Estados para manejo de cantidad y feedback visual
  const [qty, setQty] = useState(1)                    // Cantidad a agregar al carrito
  const [error, setError] = useState('')               // Mensajes de error para el usuario
  const [success, setSuccess] = useState('')           // Mensajes de éxito para el usuario
  const [imageError, setImageError] = useState(false)  // Control de errores de carga de imagen
  const [showLoginModal, setShowLoginModal] = useState(false) // Control del modal de login
  
  /**
   * MANEJAR ERROR DE CARGA DE IMAGEN
   * 
   * Se ejecuta cuando la imagen principal del producto falla al cargar.
   * Activa el estado de error para mostrar la imagen de respaldo.
   */
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

  // El backend ya devuelve campos en inglés y español. Priorizar inglés con fallback a español
  const normalizedProduct = {
    id: product.id,
    name: product.name || product.nombreObra || 'Obra Sin Título',
    price: product.price || product.precio || 0,
    stock: product.stock || 0,
    image: getImageUrl(product.image || product.imagen),
    description: product.description || product.descripcion || '',
    artist: product.artist || product.artista || 'Artista Desconocido',
    technique: product.technique || product.tecnica || 'No especificada',
    dimensions: product.dimensions || product.dimensiones || 'No especificadas',
    year: product.year || product.anio || 'No especificado',
    style: product.style || product.estilo || 'No especificado',
    artistId: product.artistId || product.artistaId
  }

  // Función helper para manejar URLs de imagen del backend
  function getImageUrl(imageUrl) {
    if (!imageUrl) return ''
    
    // Si la URL es relativa (viene del proxy del backend), añadir base URL
    if (imageUrl.startsWith('/api/')) {
      return `http://localhost:8080${imageUrl}`
    }
    
    // Si es URL absoluta, usarla directamente
    return imageUrl
  }

  // Variables derivadas para lógica de stock y validaciones
  const hasStock = normalizedProduct.stock > 0                           // ¿Hay stock disponible?
  const canAdd = hasStock && canAddToCart(normalizedProduct, qty)        // ¿Se puede agregar la cantidad seleccionada?
  const inWishlist = isInWishlist(normalizedProduct.id)                  // ¿Está en la lista de deseos?

  /**
   * MANEJAR AGREGAR AL CARRITO
   * 
   * Intenta agregar el producto al carrito con la cantidad seleccionada.
   * Maneja estados de success/error para mostrar feedback visual al usuario.
   * 
   * Flujo:
   * 1. Limpia mensajes anteriores
   * 2. Llama a addToCart del CartContext
   * 3. Si es exitoso, muestra mensaje de confirmación
   * 4. Si falla (ej: sin stock), muestra error específico
   * 5. Auto-limpia mensajes después de unos segundos
   */
  const handleAddToCart = () => {
    try {
      setError('')
      setSuccess('')
      addToCart(normalizedProduct, qty)
      setSuccess(`¡${qty} unidad(es) agregada(s) al carrito!`)
      // Auto-limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError(error.message)
      // Auto-limpiar mensaje de error después de 5 segundos
      setTimeout(() => setError(''), 5000)
    }
  }

  /**
   * MANEJAR AGREGAR/QUITAR DE WISHLIST
   * 
   * Gestiona la adición o eliminación del producto en la wishlist.
   * Requiere autenticación del usuario para funcionar.
   * 
   * Flujo:
   * 1. Verifica si el usuario está autenticado
   * 2. Si no, muestra modal de login
   * 3. Si está autenticado, agrega o quita de wishlist según estado actual
   */
  const handleAddToWhishlist = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }
    try {
      setError('')
      setSuccess('')
      addToWishlist(normalizedProduct)
      setSuccess(`¡Obra agregada a wishlist!`)
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError(error.message)
      setTimeout(() => setError(''), 5000)
    }
  }   
  
  const handleRemoveFromWishlist = () => {
  try {
    setError('');
    setSuccess('');
    removeFromWishlist(normalizedProduct.id);
    setSuccess('¡Obra eliminada de la wishlist!');
    setTimeout(() => setSuccess(''), 3000);
  } catch (error) {
    setError(error.message);
    setTimeout(() => setError(''), 5000);
  }
};

  const handleQuantityChange = (newQty) => {
    setError('')
    setSuccess('')
    if (newQty > 0 && newQty <= normalizedProduct.stock) {
      setQty(newQty)
    }
  }

  const closeModal = () => setShowLoginModal(false)
  const goToLogin = () => {
    closeModal(); // Cerrar el modal antes de navegar
    navigate('/login');
  }

  const getStockStatus = () => {
    if (normalizedProduct.stock === 0) return 'out'
    if (normalizedProduct.stock < 5) return 'low'
    return 'good'
  }

  const getStockText = () => {
    if (normalizedProduct.stock === 0) return 'Sin stock'
    if (normalizedProduct.stock === 1) return 'Última unidad'
    if (normalizedProduct.stock < 5) return `Últimas ${normalizedProduct.stock} unidades`
    return `${normalizedProduct.stock} disponibles`
  }

  return (
    <div className="section">
      {/* Breadcrumb */}
      <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
        <Link to="/" style={{ color: 'var(--text-light)' }}>Inicio</Link> / 
        <Link to="/categorias" style={{ color: 'var(--text-light)', margin: '0 0.5rem' }}>Galería</Link> / 
        <span style={{ color: 'var(--text-color)' }}>{normalizedProduct.name}</span>
      </div>

      <div className="product-detail">
        <div className="product-detail-image-container">
          <img 
            src={imageError ? fallbackImage : normalizedProduct.image} 
            alt={normalizedProduct.name} 
            className="product-detail-image"
            onError={handleImageError}
          />
          <Link to="/categorias" className="btn btn-outline" style={{ marginTop: '1.5rem', width: '100%' }}>
            ← Seguir explorando
          </Link>
        </div>
        
        <div className="product-detail-info">
                    
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            lineHeight: '1.2',
            marginBottom: '1rem',
            color: 'var(--text-color)'
          }}>
            {normalizedProduct.name}
          </h1>
          
          <Link to={`/artists/${normalizedProduct.artistId}`} className="brand">
            {"by " + normalizedProduct.artist}
          </Link>
          
          <p className="category" style={{ 
            fontSize: '1rem',
            color: 'var(--text-light)',
            marginBottom: '1rem'
          }}>
            Categoría: {normalizedProduct.category || product.categorias?.[0] || 'Sin categoría'}
          </p>

          <div className="stock">
            <span className={`stock-dot ${getStockStatus()}`}></span>
            {getStockText()}
          </div>
          
          <div className="product-description" style={{
            marginBottom: '2rem',
            padding: '1.5rem',
            backgroundColor: '#f8f6f1',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            minHeight: '120px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ 
              fontSize: '1.2rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              color: '#333',
              borderBottom: '2px solid #007bff',
              paddingBottom: '0.5rem'
            }}>
               Descripción de la obra
            </h3>
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center'
            }}>
              <p style={{
                fontSize: '1rem',
                lineHeight: '1.6',
                color: '#555',
                margin: 0,
                fontStyle: normalizedProduct.description ? 'normal' : 'italic',
                opacity: normalizedProduct.description ? 1 : 0.8
              }}>
                {normalizedProduct.description || 'Esta obra única refleja la visión artística contemporánea con técnicas tradicionales y un enfoque moderno que captura la esencia del arte actual.'}
              </p>
            </div>
          </div>

          <div style={{ 
            marginBottom: '2rem',
            padding: '1.5rem',
            background: 'var(--light-gray)',
            borderRadius: 'var(--border-radius)',
          }}>
            <h3 style={{ 
              marginBottom: '1rem', 
              color: 'var(--primary-color)',
              fontSize: '1.2rem'
            }}>
              Características de la obra
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              fontSize: '0.95rem'
            }}>
              <div>
                <strong style={{ color: 'var(--dark-gray)' }}>Dimensiones:</strong> 
                <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-color)' }}>
                  {normalizedProduct.dimensions}
                </p>
              </div>
              <div>
                <strong style={{ color: 'var(--dark-gray)' }}>Año:</strong> 
                <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-color)' }}>
                  {normalizedProduct.year}
                </p>
              </div>
              <div>
                <strong style={{ color: 'var(--dark-gray)' }}>Técnica:</strong> 
                <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-color)' }}>
                  {normalizedProduct.technique}
                </p>
              </div>
              {normalizedProduct.style && normalizedProduct.style !== 'No especificado' && (
                <div>
                  <strong style={{ color: 'var(--dark-gray)' }}>Estilo:</strong> 
                  <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-color)' }}>
                    {normalizedProduct.style}
                  </p>
                </div>
              )}
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

          <div className="price" style={{ 
            fontSize: '2.5rem', 
            marginBottom: '1.5rem',
          }}>
            <span style={{ fontSize: '0.3em', marginRight: '0.25rem'}}></span>
            {"$ " + normalizedProduct.price.toLocaleString('es-AR')}
          </div>

          <div className="buy-section" style={{
            padding: '2rem',
            background: 'var(--light-gray)',
            borderRadius: 'var(--border-radius)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Cantidad:</label>
              <input 
                type="number" 
                min="1" 
                max={normalizedProduct.stock} 
                value={qty} 
                onChange={e => handleQuantityChange(Number(e.target.value))}
                disabled={!hasStock} // Deshabilitar si no hay stock 
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
              className={`btn ${canAdd ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flexGrow: 1, textTransform: 'uppercase', letterSpacing: '0.15em'}}
            >
              {hasStock ? 'Añadir al Carrito' : 'No disponible'}
            </button>

            <button
              onClick={inWishlist ? handleRemoveFromWishlist : handleAddToWhishlist}
              className={`wishlist-icon-btn ${inWishlist ? 'active' : ''}`}
              aria-label={inWishlist ? 'Quitar de la wishlist' : 'Agregar a la wishlist'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button> 
          </div> 
        </div>

        <div style={{ 
            borderTop: '1px solid var(--border-color)',
            paddingTop: '2rem',
            gridColumn: '1 / -1' // Asegura que ocupe todo el ancho de la grilla
          }}>
            <Modal isOpen={showLoginModal} onClose={closeModal} onLogin={goToLogin} />
        </div>
      </div>
    </div>
    
  )
}