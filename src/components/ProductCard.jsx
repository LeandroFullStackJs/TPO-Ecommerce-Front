import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useState } from 'react'

export default function ProductCard({ product }) {
  const { addToCart, canAddToCart } = useCart()
  const [imageError, setImageError] = useState(false)
  
  const handleAddToCart = () => {
    try {
      addToCart(product, 1)
    } catch (error) {
      alert(error.message)
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const hasStock = product.stock > 0
  const canAdd = hasStock && canAddToCart(product, 1)

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


  // Imagen de respaldo para obras de arte
  const fallbackImage = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center'

  return (
    <Link to={`/producto/${product.id}`} className="product-card">
      <img 
        src={imageError ? fallbackImage : product.image} 
        alt={product.name} 
        className="product-image"
        onError={handleImageError}
      />
      <div className="product-info">
        <p className="brand">{product.artist}</p>
        <h3>{product.name}</h3>
        <div className="price">
          <span className="price-currency">$</span>
          {product.price.toLocaleString('es-AR')}
        </div>
        <div className="artwork-info">
          <span>{product.dimensions}</span>
          <span> • </span>
          <span>{product.year}</span>
        </div>
        <div className="stock">
          <span className={`stock-dot ${getStockStatus()}`}></span>
          {getStockText()}
        </div>
        <p className="description">
          {product.description?.length > 100 
            ? product.description.substring(0, 100) + '...' 
            : product.description
          }
        </p>
      </div>
      <div className="product-actions" onClick={(e) => e.preventDefault()}>
        <button 
          onClick={handleAddToCart}
          disabled={!canAdd}
          className={`btn ${canAdd ? 'btn-primary' : 'btn-secondary'} btn-full`}
        >
          {hasStock ? ' Adquirir Obra' : 'No disponible'}
        </button>
      </div>
    </Link>
  )
}