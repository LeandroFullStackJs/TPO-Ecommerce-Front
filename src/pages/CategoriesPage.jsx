import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { categoriesAPI } from '../api/categories'
import { useProducts } from '../context/ProductContext'
import { FaSearch } from "react-icons/fa";


export default function CategoriesPage() {
  const { products, loading } = useProducts()

  // Manejo de búsqueda y categoría desde la URL
  const [searchParams, setSearchParams] = useSearchParams()
  const [q, setQ] = useState(searchParams.get('q') || '')
  const [cat, setCat] = useState(searchParams.get('cat') || '')

  // Categorías obtenidas desde la API
  const [categories, setCategories] = useState([])

  // Control de qué filtros están desplegados (acordeones)
  const [expandedFilters, setExpandedFilters] = useState({
    categories: false,
    technique: false,
    style: false,
    artist: false,
    dimensions: false,
    pallette: false,
    price: false
  })

  // Estado de filtros seleccionados (checkboxes)
  const [filters, setFilters] = useState({
    technique: [],
    style: [],
    artist: [],
    dimensions: [],
    pallette: [],
    price: []
  })

  // Cargar categorías desde la API
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

  // Actualizar la URL cuando cambian búsqueda o categoría
  useEffect(() => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (cat) params.set('cat', cat)
    setSearchParams(params)
  }, [q, cat, setSearchParams])

  // Manejar cambios de checkboxes
  const handleFilterChange = (filterName, option) => {
    setFilters(prev => {
      const current = prev[filterName]
      const exists = current.includes(option)
      return {
        ...prev,
        [filterName]: exists
          ? current.filter(item => item !== option) // si ya estaba, lo saco
          : [...current, option] // si no estaba, lo agrego
      }
    })
  }

  // Función auxiliar: verificar si un precio entra en un rango elegido
  const checkPriceMatch = (productPrice, ranges) => {
    if (!ranges || ranges.length === 0) return true

    return ranges.some(range => {
      if (range.includes('+')) {
        // Ejemplo "$200.000+"
        const min = parseInt(range.replace(/\D/g, ''), 10)
        return productPrice >= min
      } else {
        // Ejemplo "$0 - $50.000"
        const [minStr, maxStr] = range.replace(/\$/g, '').split('-')
        const min = parseInt(minStr.trim().replace('.', ''), 10)
        const max = parseInt(maxStr.trim().replace('.', ''), 10)
        return productPrice >= min && productPrice <= max
      }
    })
  }

  // Filtrar productos (texto + categoría + todos los filtros seleccionados)
  const filtered = useMemo(() => {
    if (!products) return []

    return products
      .filter(p => {
        const matchText = (p.name + ' ' + (p.artist || '') + ' ' + (p.description || ''))
          .toLowerCase()
          .includes(q.toLowerCase())

        const matchCat = !cat || p.category === cat
        const matchTechnique = filters.technique.length === 0 || filters.technique.includes(p.technique)
        const matchStyle = filters.style.length === 0 || filters.style.includes(p.style)
        const matchArtist = filters.artist.length === 0 || filters.artist.includes(p.artist)
        const matchSize= filters.dimensions.length === 0 || filters.dimensions.includes(p.dimensions)
        const matchPallette = filters.pallette.length === 0 || filters.pallette.includes(p.pallette)
        const matchPrice = filters.price.length === 0 || checkPriceMatch(p.price, filters.price)

        return (
          matchText &&
          matchCat &&
          matchTechnique &&
          matchStyle &&
          matchArtist &&
          matchSize &&
          matchPallette &&
          matchPrice
        )
      })
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [q, cat, filters, products])

  // Limpiar filtros y búsqueda
  const clearFilters = () => {
    setQ('')
    setCat('')
    setFilters({
      technique: [],
      style: [],
      artist: [],
      dimensions: [],
      pallette: [],
      price: []
    })
  }

  // Expandir o colapsar un bloque de filtros
  const toggleFilter = (filterName) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }))
  }

  // Opciones de filtros (predefinidas)
  const filterOptions = {
    technique: ['Óleo', 'Tempera', 'Grafito', 'Acrílico', 'Acuarela', 'Carboncillo'],
    style: ['Abstracto', 'Realista', 'Impresionista', 'Moderno', 'Clásico', 'Contemporáneo'],
    artist: ['Inés', 'Javier', 'Gabriel', 'Luis', 'Van Gogh', 'Picasso'],
    //size: ['Pequeño (20x30cm)', 'Mediano (40x60cm)', 'Grande (80x120cm)', 'Extra Grande (100x150cm)'],
    dimensions: ['60x80 cm', '70x50 cm', '50x70 cm', '80x80 cm', '60x90 cm', '100x70 cm', '75x60 cm', '65x85 cm', '60x60'],
    pallette: ['Monocromático', 'Colorido', 'Pasteles', 'Neutros', 'Cálidos', 'Fríos'],
    price: ['$0 - $50.000', '$50.000 - $100.000', '$100.000 - $200.000', '$200.000+']
  }

  // Pantalla de carga
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

      {/* Contenido principal con sidebar y productos */}
      <div className="categories-content">
        
        {/* === SIDEBAR DE FILTROS === */}
        <div className="categories-sidebar">
          <div className="filters-header">
            <h3 className="filters-title">Filters</h3>
            {(q || cat || Object.values(filters).some(arr => arr.length > 0)) && (
              <button 
                className="clear-filters-btn"
                onClick={clearFilters}
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {/* === Filtro de Categorías === */}
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

          {/* === Resto de filtros dinámicos === */}
          {Object.keys(filterOptions).map(filterName => (
            <div key={filterName} className="filter-section">
              <button 
                className="filter-toggle"
                onClick={() => toggleFilter(filterName)}
              >
                <span>{filterName.charAt(0).toUpperCase() + filterName.slice(1)}</span>
                <span className={`filter-chevron ${expandedFilters[filterName] ? 'expanded' : ''}`}>▼</span>
              </button>
              {expandedFilters[filterName] && (
                <div className="filter-options">
                  {filterOptions[filterName].map(option => (
                    <label key={option} className="filter-option">
                      <input 
                        type="checkbox"
                        checked={filters[filterName].includes(option)}
                        onChange={() => handleFilterChange(filterName, option)}
                      />
                      <span className="filter-option-text">{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

{/* === LISTADO DE PRODUCTOS === */}
<div className="categories-main">

  {/* Contenedor de la barra de búsqueda */}
  <div className="categories-search-container">
    <FaSearch className="search-iconCategories" />
    <input
      type="text"
      placeholder="Buscar obras o artistas..."
      value={q}
      onChange={(e) => setQ(e.target.value)}
      className="categories-search-input"
    />

  </div>

  {/* Grilla de productos */}
  <div className="products-grid">
    {filtered.length === 0 ? (
      <p>No se encontraron resultados</p>
    ) : (
      filtered.map(product => (
        <ProductCard key={product.id} product={product} />
      ))
    )}
  </div>

  {/* Botón de cargar más */}
  <div className="load-more-container">
    <button className="load-more-btn">
      Load more products
    </button>
  </div>
</div>
      </div>
    </div>
  )
}
