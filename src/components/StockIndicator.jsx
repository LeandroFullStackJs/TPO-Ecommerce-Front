import { useProducts } from '../context/ProductContext'

export default function StockIndicator({ productId, showLabel = true }) {
  const { products } = useProducts()
  const product = products.find(p => p.id === productId)
  
  if (!product) return null

  const hasStock = product.stock > 0
  const isLowStock = product.stock <= 5 && product.stock > 0

  const getStockColor = () => {
    if (!hasStock) return '#dc3545' // Rojo para sin stock
    if (isLowStock) return '#ffc107' // Amarillo para stock bajo
    return '#28a745' // Verde para stock normal
  }

  const getStockText = () => {
    if (!hasStock) return 'Sin stock'
    if (isLowStock) return `Stock bajo: ${product.stock}`
    return `${product.stock} unidades`
  }

  return (
    <div className="stock-indicator">
      {showLabel && <span className="stock-label">Stock:</span>}
      <span 
        className="stock-value"
        style={{ color: getStockColor() }}
      >
        {getStockText()}
      </span>
      {isLowStock && hasStock && (
        <span className="stock-warning">
          ⚠️
        </span>
      )}
      {!hasStock && (
        <span className="stock-error">
          ❌
        </span>
      )}
    </div>
  )
}
