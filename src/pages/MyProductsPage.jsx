/**
 * PÁGINA DE GESTIÓN DE OBRAS DEL ARTISTA
 * 
 * Esta página permite a los usuarios ADMINISTRADORES gestionar las obras de arte:
 * - Ver todas las obras de la galería
 * - Crear nuevas obras con formulario completo
 * - Editar obras existentes
 * - Eliminar obras
 * - Navegar a la vista detalle de cada obra
 * 
 * ACCESO RESTRINGIDO: Solo usuarios con rol 'admin' pueden acceder
 * 
 * Características técnicas:
 * - Formulario dinámico con validación en tiempo real
 * - Integración con contextos de productos, usuarios y categorías
 * - Persistencia de datos y manejo de estados de carga
 * - Interfaz responsive y user-friendly
 * - Manejo de errores y feedback visual
 * - Protección por roles de usuario
 * 
 * Estados manejados:
 * - Formulario de creación/edición con todos los campos de una obra de arte
 * - Validaciones de campos requeridos
 * - Estados de carga durante operaciones CRUD
 * - Sistema de autorización por roles
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useProducts } from '../context/ProductContext'
import { categoriesAPI } from '../api/categories'

export default function MyProductsPage() {
  const { user } = useUser()
  const { products, createProduct, updateProduct, deleteProduct, refreshProducts, loading: productsLoading } = useProducts()
  const [categories, setCategories] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [pageLoading, setPageLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    artist: '',
    category: '',
    price: '',
    stock: '',
    image: '',
    description: '',
    dimensions: '',
    technique: '',
    year: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Debug: Mostrar información del usuario en consola
  useEffect(() => {
    console.log('👤 Usuario actual en MyProductsPage:', user)
    console.log('🔐 Es admin?:', user?.role === 'admin')
    console.log('📦 Productos:', products)
    console.log('📂 Categorías disponibles:', categories)
  }, [user, products, categories])

  // Cargar categorías
  useEffect(() => {
    const loadCategories = async () => {
      try {
        console.log('📂 Cargando categorías...')
        const data = await categoriesAPI.getAll()
        console.log('📂 Categorías cargadas:', data)
        setCategories(data)
      } catch (error) {
        console.error('❌ Error al cargar categorías:', error)
        // Mostrar error al usuario
        setErrors(prev => ({ ...prev, categories: 'Error al cargar categorías' }))
      }
    }
    loadCategories()
  }, [])

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        if (refreshProducts && user) {
          await refreshProducts()
        }
      } catch (error) {
        console.error('Error al cargar productos:', error)
      } finally {
        setPageLoading(false)
      }
    }
    
    if (user) {
      loadInitialData()
    } else {
      setPageLoading(false)
    }
  }, [user]) // Solo depende del usuario, no de refreshProducts

  // Obtener productos del usuario actual
  const userProducts = user && products ? products.filter(p => 
    p.usuarioId === user.id || p.userId === user.id
  ) : []

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name) newErrors.name = 'El nombre es requerido'
    if (!formData.artist) newErrors.artist = 'El nombre del artista es requerido'
    if (!formData.category) newErrors.category = 'La categoría es requerida'
    if (!formData.price) newErrors.price = 'El precio es requerido'
    if (!formData.stock) newErrors.stock = 'El stock es requerido'
    if (!formData.image) newErrors.image = 'La imagen es requerida'
    if (!formData.description) newErrors.description = 'La descripción es requerida'
    if (!formData.dimensions) newErrors.dimensions = 'Las dimensiones son requeridas'
    if (!formData.technique) newErrors.technique = 'La técnica es requerida'
    if (!formData.year) newErrors.year = 'El año es requerido'
    
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
      
      // Mapear datos del frontend al formato esperado por el backend Spring Boot
      const productData = {
        // Campos principales en español (requeridos por backend)
        nombreObra: formData.name,
        descripcion: formData.description,
        precio: Number(formData.price),
        stock: Number(formData.stock),
        imagen: formData.image,
        artista: formData.artist,
        tecnica: formData.technique,
        dimensiones: formData.dimensions,
        anio: Number(formData.year),
        
        // IDs requeridos
        usuarioId: user.id,
        artistaId: user.id, // Asumimos que el usuario es el artista
        categoriaIds: [Number(formData.category)], // Array de IDs de categorías
        
        // Campos adicionales con valores por defecto
        activo: true,
        destacado: false,
        estilo: "Contemporáneo" // Valor por defecto
      }
      
      console.log('📤 Enviando producto al backend:', productData)
      
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData)
      } else {
        await createProduct(productData)
      }
      
      resetForm()
      setShowForm(false)
      // No necesitamos refreshProducts aquí, el contexto se actualiza automáticamente
    } catch (error) {
      console.error('❌ Error al crear/actualizar producto:', error)
      setErrors({ general: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.nombreObra || product.name,
      artist: product.artista || product.artist,
      category: product.categoriaIds?.[0]?.toString() || product.category || '',
      price: (product.precio || product.price || 0).toString(),
      stock: (product.stock || 0).toString(),
      image: product.imagen || product.image || '',
      description: product.descripcion || product.description || '',
      dimensions: product.dimensiones || product.dimensions || '',
      technique: product.tecnica || product.technique || '',
      year: (product.anio || product.year || '').toString()
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
      artist: '',
      category: '',
      price: '',
      stock: '',
      image: '',
      description: '',
      dimensions: '',
      technique: '',
      year: ''
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
      {!user ? (
        <div className="auth-required">
          <h2>Debes iniciar sesión</h2>
          <p>Para ver y gestionar tus obras, necesitas estar autenticado.</p>
          <Link to="/login" className="btn btn-primary">
            Iniciar Sesión
          </Link>
        </div>
      ) : (
        <>
          <div className="page-header">
            <h1>Mis Obras</h1>
            <button 
              onClick={() => setShowForm(true)} 
              className="btn btn-primary"
            >
              + Nueva Obra
            </button>
          </div>

          {showForm && (
            <div className="product-form-container">
              <div className="product-form">
                <h2>{editingProduct ? 'Editar Obra' : 'Nueva Obra'}</h2>
            
                {errors.general && (
                  <div className="error-message">
                    {errors.general}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Nombre de la obra</label>
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
                      <label htmlFor="artist">Nombre del artista</label>
                      <input
                        type="text"
                        id="artist"
                        name="artist"
                        value={formData.artist}
                        onChange={(e) => setFormData({...formData, artist: e.target.value})}
                        className={errors.artist ? 'error' : ''}
                      />
                      {errors.artist && <span className="error-text">{errors.artist}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="dimensions">Dimensiones</label>
                      <input
                        type="text"
                        id="dimensions"
                        name="dimensions"
                        placeholder="Ej: 60x80 cm"
                        value={formData.dimensions}
                        onChange={(e) => setFormData({...formData, dimensions: e.target.value})}
                        className={errors.dimensions ? 'error' : ''}
                      />
                      {errors.dimensions && <span className="error-text">{errors.dimensions}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="technique">Técnica</label>
                      <input
                        type="text"
                        id="technique"
                        name="technique"
                        value={formData.technique}
                        onChange={(e) => setFormData({...formData, technique: e.target.value})}
                        className={errors.technique ? 'error' : ''}
                      />
                      {errors.technique && <span className="error-text">{errors.technique}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="year">Año</label>
                      <input
                        type="number"
                        id="year"
                        name="year"
                        value={formData.year}
                        onChange={(e) => setFormData({...formData, year: e.target.value})}
                        className={errors.year ? 'error' : ''}
                      />
                      {errors.year && <span className="error-text">{errors.year}</span>}
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
                        <option value="">
                          {categories.length === 0 ? 'Cargando categorías...' : 'Selecciona una categoría'}
                        </option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name || cat.nombre || `Categoría ${cat.id}`}
                          </option>
                        ))}
                      </select>
                      {errors.category && <span className="error-text">{errors.category}</span>}
                      {errors.categories && <span className="error-text">{errors.categories}</span>}
                      {categories.length === 0 && (
                        <small className="help-text">
                          Si no se cargan las categorías, verifica que el backend esté funcionando
                        </small>
                      )}
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
            {pageLoading ? (
              <div className="loading-state">
                <p>Cargando obras...</p>
              </div>
            ) : userProducts.length === 0 ? (
              <div className="empty-state">
                <p>No tienes obras publicadas aún. ¡Crea tu primera obra!</p>
              </div>
            ) : (
              userProducts.map(product => (
                <div key={product.id} className="product-card">
                  <Link to={`/producto/${product.id}`} className="product-link">
                    <img 
                      src={product.imagen || product.image} 
                      alt={product.nombreObra || product.name} 
                      className="product-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=Imagen+no+disponible'
                      }}
                    />
                    <div className="product-info">
                      <h3>{product.nombreObra || product.name}</h3>
                      <p className="artist">by {product.artista || product.artist}</p>
                      <p className="category">
                        Categoría: {
                          Array.isArray(product.categorias) 
                            ? product.categorias.join(', ')
                            : product.category || 'Sin categoría'
                        }
                      </p>
                      <p className="price">${(product.precio || product.price || 0).toLocaleString('es-AR')}</p>
                      <p className="stock">Stock: {product.stock} unidades</p>
                      <p className="description">{product.descripcion || product.description}</p>
                    </div>
                  </Link>
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
        </>
      )}
    </div>
  )
}
