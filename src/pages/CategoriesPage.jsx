import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { categoriesAPI } from '../api/categories'
import { useProducts } from '../context/ProductContext'

export default function CategoriesPage() {
  const { products, loading } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const [q, setQ] = useState(searchParams.get('q') || '')
  const [cat, setCat] = useState(searchParams.get('cat') || '')
  const [categories, setCategories] = useState([])
  const [expandedFilters, setExpandedFilters] = useState({
    categories: false,
    technique: false,
    style: false,
    artist: false,
    size: false,
    palette: false,
    price: false
  })
  
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

  // Actualizar URL cuando cambian los filtros
  useEffect(() => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (cat) params.set('cat', cat)
    setSearchParams(params)
  }, [q, cat, setSearchParams])
  
  const filtered = useMemo(() => {
    if (!products) return []
    return products
      .filter(p => {
        const matchText = (p.name + ' ' + (p.artist || '') + ' ' + (p.description || ''))
          .toLowerCase()
          .includes(q.toLowerCase())
        const matchCat = !cat || p.category === cat
        return matchText && matchCat
      })
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [q, cat, products])

  const clearFilters = () => {
    setQ('')
    setCat('')
  }

  const toggleFilter = (filterName) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }))
  }

  // Datos de ejemplo para los filtros con variantes específicas
  const filterOptions = {
    technique: ['Óleo', 'Tempera', 'Grafito', 'Acrílico', 'Acuarela', 'Carboncillo'],
    style: ['Abstracto', 'Realista', 'Impresionista', 'Moderno', 'Clásico', 'Contemporáneo'],
    artist: ['Inés', 'Javier', 'Gabriel', 'Luis', 'Van Gogh', 'Picasso'],
    size: ['Pequeño (20x30cm)', 'Mediano (40x60cm)', 'Grande (80x120cm)', 'Extra Grande (100x150cm)'],
    palette: ['Monocromático', 'Colorido', 'Pasteles', 'Neutros', 'Cálidos', 'Fríos'],
    price: ['$0 - $50.000', '$50.000 - $100.000', '$100.000 - $200.000', '$200.000+']
  }

  if (loading) {
    return (
      <div className="categories-layout">
        <div className="categories-header">
          <h1 className="categories-title">Explorá pinturas</h1>
        </div>
        <div className="categories-content">
          <div className="categories-sidebar">
            <div className="loading">Cargando filtros...</div>
          </div>
          <div className="categories-main">
            <div className="loading">Cargando productos...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="categories-layout">
      {/* Header principal */}
      <div className="categories-header">
        <h1 className="categories-title">Explorá pinturas</h1>
      </div>

      {/* Contenido principal con sidebar y área de productos */}
      <div className="categories-content">
        {/* Sidebar de filtros */}
        <div className="categories-sidebar">
          <div className="filters-header">
            <h3 className="filters-title">Filters</h3>
            {(q || cat) && (
              <button 
                className="clear-filters-btn"
                onClick={clearFilters}
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Filtro de Categorías */}
          <div className="filter-section">
            <button 
              className="filter-toggle"
              onClick={() => toggleFilter('categories')}
            >
              <span>Categorías</span>
              <span className={`filter-chevron ${expandedFilters.categories ? 'expanded' : ''}`}>▼</span>
            </button>
            {expandedFilters.categories && (
              <div className="filter-options">
                {categories.map(category => (
                  <label key={category.id} className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      value={category.id}
                      checked={cat === category.id}
                      onChange={(e) => setCat(e.target.value)}
                    />
                    <span className="filter-option-text">{category.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Filtro de Técnica */}
          <div className="filter-section">
            <button 
              className="filter-toggle"
              onClick={() => toggleFilter('technique')}
            >
              <span>Técnica</span>
              <span className={`filter-chevron ${expandedFilters.technique ? 'expanded' : ''}`}>▼</span>
            </button>
            {expandedFilters.technique && (
              <div className="filter-options">
                {filterOptions.technique.map(option => (
                  <label key={option} className="filter-option">
                    <input type="checkbox" />
                    <span className="filter-option-text">{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Filtro de Estilo */}
          <div className="filter-section">
            <button 
              className="filter-toggle"
              onClick={() => toggleFilter('style')}
            >
              <span>Estilo</span>
              <span className={`filter-chevron ${expandedFilters.style ? 'expanded' : ''}`}>▼</span>
            </button>
            {expandedFilters.style && (
              <div className="filter-options">
                {filterOptions.style.map(option => (
                  <label key={option} className="filter-option">
                    <input type="checkbox" />
                    <span className="filter-option-text">{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Filtro de Artista */}
          <div className="filter-section">
            <button 
              className="filter-toggle"
              onClick={() => toggleFilter('artist')}
            >
              <span>Artista</span>
              <span className={`filter-chevron ${expandedFilters.artist ? 'expanded' : ''}`}>▼</span>
            </button>
            {expandedFilters.artist && (
              <div className="filter-options">
                {filterOptions.artist.map(option => (
                  <label key={option} className="filter-option">
                    <input type="checkbox" />
                    <span className="filter-option-text">{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Filtro de Tamaño */}
          <div className="filter-section">
            <button 
              className="filter-toggle"
              onClick={() => toggleFilter('size')}
            >
              <span>Tamaño</span>
              <span className={`filter-chevron ${expandedFilters.size ? 'expanded' : ''}`}>▼</span>
            </button>
            {expandedFilters.size && (
              <div className="filter-options">
                {filterOptions.size.map(option => (
                  <label key={option} className="filter-option">
                    <input type="checkbox" />
                    <span className="filter-option-text">{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Filtro de Paleta */}
          <div className="filter-section">
            <button 
              className="filter-toggle"
              onClick={() => toggleFilter('palette')}
            >
              <span>Paleta</span>
              <span className={`filter-chevron ${expandedFilters.palette ? 'expanded' : ''}`}>▼</span>
            </button>
            {expandedFilters.palette && (
              <div className="filter-options">
                {filterOptions.palette.map(option => (
                  <label key={option} className="filter-option">
                    <input type="checkbox" />
                    <span className="filter-option-text">{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Filtro de Precio */}
          <div className="filter-section">
            <button 
              className="filter-toggle"
              onClick={() => toggleFilter('price')}
            >
              <span>Precio</span>
              <span className={`filter-chevron ${expandedFilters.price ? 'expanded' : ''}`}>▼</span>
            </button>
            {expandedFilters.price && (
              <div className="filter-options">
                {filterOptions.price.map(option => (
                  <label key={option} className="filter-option">
                    <input type="checkbox" />
                    <span className="filter-option-text">{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Área principal de productos */}
        <div className="categories-main">
          {/* Barra de búsqueda */}
          <div className="search-bar-container">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Buscá obras de arte"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="search-input-main"
              />
              <button className="search-button">🔍</button>
            </div>
          </div>

          {/* Opciones de visualización */}
          <div className="view-options">
            <div className="view-label">View as</div>
            <div className="products-count">
              Showing {filtered.length} Products
            </div>
            <div className="sort-dropdown">
              <select className="sort-select">
                <option>Sort By A-Z</option>
                <option>Sort By Z-A</option>
                <option>Sort By Price Low-High</option>
                <option>Sort By Price High-Low</option>
              </select>
            </div>
          </div>

          {/* Grid de productos */}
          {filtered.length === 0 ? (
            <div className="empty-state">
              <h3>No se encontraron obras</h3>
              <p>Intenta ajustar tus filtros de búsqueda</p>
            </div>
          ) : (
            <>
              <div className="products-grid-categories">
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
              
              {/* Botón de cargar más */}
              <div className="load-more-container">
                <button className="load-more-btn">
                  Load more products
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
