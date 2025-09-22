/**
 * COMPONENTE PRODUCTCARD - TARJETA DE PRODUCTO/OBRA DE ARTE
 * 
 * Este componente renderiza una tarjeta individual para mostrar una obra de arte
 * con toda su información relevante y funcionalidades de interacción.
 * Se utiliza en catálogos, listados de productos y búsquedas.
 * 
 * Características principales:
 * - Imagen de la obra con manejo de errores y fallback
 * - Información detallada: artista, nombre, precio, dimensiones, año
 * - Indicador visual de stock disponible
 * - Botón para agregar al carrito con validaciones
 * - Navegación a página de detalle del producto
 * - Descripción truncada para mantener diseño consistente
 * 
 * Dependencias:
 * - CartContext: Para agregar productos al carrito y validar stock
 * - React Router: Para navegación a páginas de detalle
 */

import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useState } from 'react'

/**
 * COMPONENTE PRODUCTCARD
 * 
 * Tarjeta de producto que muestra información esencial y permite
 * interacción básica (agregar al carrito, ver detalles).
 * 
 * @param {Object} props - Props del componente
 * @param {Object} props.product - Objeto con datos del producto/obra
 * @param {number} props.product.id - ID único del producto
 * @param {string} props.product.name - Nombre de la obra
 * @param {string} props.product.artist - Nombre del artista
 * @param {number} props.product.price - Precio de la obra
 * @param {string} props.product.image - URL de la imagen
 * @param {number} props.product.stock - Cantidad disponible
 * @param {string} props.product.dimensions - Dimensiones de la obra
 * @param {number} props.product.year - Año de creación
 * @param {string} props.product.description - Descripción de la obra
 */
export default function ProductCard({ product }) {
  // Obtener funciones del carrito
  const { addToCart, canAddToCart } = useCart()
  
  // Estado para manejar errores de carga de imagen
  const [imageError, setImageError] = useState(false)
  
  /**
   * MANEJAR AGREGAR AL CARRITO
   * 
   * Intenta agregar el producto al carrito con validaciones.
   * Muestra mensaje de error si no es posible (stock insuficiente).
   */
  const handleAddToCart = () => {
    try {
      addToCart(product, 1)  // Agregar 1 unidad al carrito
    } catch (error) {
      alert(error.message)   // Mostrar mensaje de error al usuario
    }
  }

  /**
   * MANEJAR ERROR DE IMAGEN
   * 
   * Se ejecuta cuando la imagen del producto falla al cargar.
   * Activa el estado de error para mostrar imagen de respaldo.
   */
  const handleImageError = () => {
    setImageError(true)
  }

  // Variables derivadas para lógica de stock
  const hasStock = product.stock > 0                      // ¿Hay stock disponible?
  const canAdd = hasStock && canAddToCart(product, 1)     // ¿Se puede agregar al carrito?

  /**
   * OBTENER ESTADO DEL STOCK
   * 
   * Determina el estado visual del stock para aplicar estilos CSS.
   * 
   * @returns {string} Estado del stock: 'out', 'low', o 'good'
   */
  const getStockStatus = () => {
    if (product.stock === 0) return 'out'      // Sin stock
    if (product.stock < 5) return 'low'        // Stock bajo
    return 'good'                              // Stock bueno
  }

  /**
   * OBTENER TEXTO DEL STOCK
   * 
   * Genera el texto descriptivo del stock para mostrar al usuario.
   * 
   * @returns {string} Texto descriptivo del stock
   */
  const getStockText = () => {
    if (product.stock === 0) return 'Sin stock'
    if (product.stock === 1) return 'Última unidad'
    if (product.stock < 5) return `Últimas ${product.stock} unidades`
    return `${product.stock} disponibles`
  }

  // Imagen de respaldo artística para casos de error
  const fallbackImage = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center'

  return (
    <Link to={`/producto/${product.id}`} className="product-card">
      {/* IMAGEN DE LA OBRA CON MANEJO DE ERRORES */}
      <img 
        src={imageError ? fallbackImage : product.image} 
        alt={product.name} 
        className="product-image"
        onError={handleImageError}
      />
      
      {/* INFORMACIÓN PRINCIPAL DEL PRODUCTO */}
      <div className="product-info">
        {/* Artista (equivalente a "marca" en productos tradicionales) */}
        <p className="brand">{product.artist}</p>
        
        {/* Nombre de la obra */}
        <h3>{product.name}</h3>
        
        {/* Precio formateado para Argentina */}
        <div className="price">
          <span className="price-currency">$</span>
          {product.price.toLocaleString('es-AR')}
        </div>
        
        {/* Información específica de obras de arte */}
        <div className="artwork-info">
          <span>{product.dimensions}</span>
          <span> • </span>
          <span>{product.year}</span>
        </div>
        
        {/* Indicador visual de stock */}
        <div className="stock">
          <span className={`stock-dot ${getStockStatus()}`}></span>
          {getStockText()}
        </div>
        
        {/* Descripción truncada */}
        <p className="description">
          {product.description?.length > 100 
            ? product.description.substring(0, 100) + '...' 
            : product.description
          }
        </p>
      </div>
      
      {/* ACCIONES DEL PRODUCTO */}
      {/* Prevenir navegación al hacer clic en acciones */}
      <div className="product-actions" onClick={(e) => e.preventDefault()}>
        <button 
          onClick={handleAddToCart}
          disabled={!canAdd}
          className={`btn ${canAdd ? 'btn-primary' : 'btn-secondary'} btn-full`}
        >
          {hasStock ? 'Adquirir Obra' : 'No disponible'}
        </button>
      </div>
    </Link>
  )
}