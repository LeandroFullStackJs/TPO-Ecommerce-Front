import { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'
import { useProducts } from '../context/ProductContext'
import { categoriesAPI } from '../api/categories'

export default function MyProductsPage() {
  const { user } = useUser()
  const { products, createProduct, updateProduct, deleteProduct, refreshProducts } = useProducts()
  const [categories, setCategories] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    stock: '',
    image: '',
    description: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Cargar categorías
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoriesAPI.getAll()
        setCategories(data)
      } catch (error) {
        console.error('Error al cargar categorías:', error)
      }
    }
    loadCategories()
  }, [])

  // Obtener productos del usuario actual
  const userProducts = products.filter(p => p.userId === user?.id)

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name) newErrors.name = 'El nombre es requerido'
    if (!formData.brand) newErrors.brand = 'La marca es requerida'
    if (!formData.category) newErrors.category = 'La categoría es requerida'
    if (!formData.price) newErrors.price = 'El precio es requerido'
    if (!formData.stock) newErrors.stock = 'El stock es requerido'
    if (!formData.image) newErrors.image = 'La imagen es requerida'
    if (!formData.description) newErrors.description = 'La descripción es requerida'
    
    if (formData.price && isNaN(formData.price)) {
      newErrors.price = 'El precio debe ser un número'
    }
    if (formData.stock && isNaN(formData.stock)) {
      newErrors.stock = 'El stock debe ser un número'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      setLoading(true)
      
      const productData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        userId: user.id,
        id: editingProduct ? editingProduct.id : Date.now().toString()
      }
      
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData)
      } else {
        await createProduct(productData)
      }
      
      resetForm()
      setShowForm(false)
    } catch (error) {
      setErrors({ general: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      image: product.image,
      description: product.description
    })
    setShowForm(true)
  }

  const handleDelete = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteProduct(productId)
      } catch (error) {
        alert('Error al eliminar el producto')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      category: '',
      price: '',
      stock: '',
      image: '',
      description: ''
    })
    setEditingProduct(null)
    setErrors({})
  }

  const handleCancel = () => {
    resetForm()
    setShowForm(false)
  }

  return (
    <div className="my-products-page">
      <div className="page-header">
        <h1>Mis Productos</h1>
        <button 
          onClick={() => setShowForm(true)} 
          className="btn btn-primary"
        >
          + Nuevo Producto
        </button>
      </div>

      {showForm && (
        <div className="product-form-container">
          <div className="product-form">
            <h2>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            
            {errors.general && (
              <div className="error-message">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Nombre del producto</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="brand">Marca</label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    className={errors.brand ? 'error' : ''}
                  />
                  {errors.brand && <span className="error-text">{errors.brand}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Categoría</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className={errors.category ? 'error' : ''}
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && <span className="error-text">{errors.category}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="price">Precio</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className={errors.price ? 'error' : ''}
                    min="0"
                    step="0.01"
                  />
                  {errors.price && <span className="error-text">{errors.price}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="stock">Stock</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className={errors.stock ? 'error' : ''}
                    min="0"
                  />
                  {errors.stock && <span className="error-text">{errors.stock}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="image">URL de la imagen</label>
                  <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className={errors.image ? 'error' : ''}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  {errors.image && <span className="error-text">{errors.image}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Descripción</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className={errors.description ? 'error' : ''}
                  rows="3"
                />
                {errors.description && <span className="error-text">{errors.description}</span>}
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleCancel} className="btn btn-outline">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Guardando...' : (editingProduct ? 'Actualizar' : 'Crear')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="products-grid">
        {userProducts.length === 0 ? (
          <div className="empty-state">
            <p>No tienes productos aún. ¡Crea tu primer producto!</p>
          </div>
        ) : (
          userProducts.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="brand">{product.brand}</p>
                <p className="price">${product.price.toLocaleString('es-AR')}</p>
                <p className="stock">Stock: {product.stock} unidades</p>
                <p className="description">{product.description}</p>
              </div>
              <div className="product-actions">
                <button 
                  onClick={() => handleEdit(product)} 
                  className="btn btn-outline btn-sm"
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(product.id)} 
                  className="btn btn-danger btn-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
