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
  
  // Función helper para formatear precio de manera segura
  const formatPrice = (price) => {
    if (price === null || price === undefined || isNaN(price)) {
      return 'Consultar precio'
    }
    return Number(price).toLocaleString('es-AR')
  }
  
  // Normalizar datos del producto para manejar diferentes estructuras del backend
  const normalizedProduct = {
    ...product,
    name: product.name || product.nombre || product.title || 'Producto sin nombre',
    price: product.price || product.precio || 0,
    image: product.image || product.imagen || product.foto || '/default-product.jpg',
    artist: product.artist || product.artista || product.creator || 'Artista desconocido',
    stock: product.stock || product.cantidad || 0,
    dimensions: product.dimensions || product.dimensiones || 'Sin especificar',
    year: product.year || product.año || product.yearCreated || 'Sin fecha',
    description: product.description || product.descripcion || product.desc || ''
  }

  /**
   * MANEJAR AGREGAR AL CARRITO
   * 
   * Intenta agregar el producto al carrito con validaciones.
   * Muestra mensaje de error si no es posible (stock insuficiente).
   */
  const handleAddToCart = () => {
    try {
      addToCart(normalizedProduct, 1)  // Agregar 1 unidad al carrito
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
  const hasStock = normalizedProduct.stock > 0                      // ¿Hay stock disponible?
  const canAdd = hasStock && canAddToCart(normalizedProduct, 1)     // ¿Se puede agregar al carrito?

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
    if (normalizedProduct.stock === 0) return 'Sin stock'
    if (normalizedProduct.stock === 1) return 'Última unidad'
    if (normalizedProduct.stock < 5) return `Últimas ${normalizedProduct.stock} unidades`
    return `${normalizedProduct.stock} disponibles`
  }

  // Imagen de respaldo artística para casos de error
  const fallbackImage = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center'

  return (
    <Link to={`/producto/${normalizedProduct.id}`} className="product-card">
      {/* IMAGEN DE LA OBRA CON MANEJO DE ERRORES */}
      <img 
        src={imageError ? fallbackImage : normalizedProduct.image} 
        alt={normalizedProduct.name} 
        className="product-image"
        onError={handleImageError}
      />
      
      {/* INFORMACIÓN PRINCIPAL DEL PRODUCTO */}
      <div className="product-info">
        {/* Artista (equivalente a "marca" en productos tradicionales) */}
        <p className="brand">{normalizedProduct.artist}</p>
        
        {/* Nombre de la obra */}
        <h3>{normalizedProduct.name}</h3>
        
        {/* Precio formateado para Argentina */}
        <div className="price">
          <span className="price-currency">$</span>
          {formatPrice(normalizedProduct.price)}
        </div>
        
        {/* Información específica de obras de arte */}
        <div className="artwork-info">
          <span>{normalizedProduct.dimensions}</span>
          <span> • </span>
          <span>{normalizedProduct.year}</span>
        </div>
        
        {/* Indicador visual de stock */}
        <div className="stock">
          <span className={`stock-dot ${getStockStatus()}`}></span>
          {getStockText()}
        </div>
        
        {/* Descripción truncada */}
        <p className="description">
          {normalizedProduct.description?.length > 100 
            ? normalizedProduct.description.substring(0, 100) + '...' 
            : normalizedProduct.description
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