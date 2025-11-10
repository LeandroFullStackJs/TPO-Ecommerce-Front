/**
 * PÁGINA DE CATEGORÍAS - CATÁLOGO Y FILTRADO DE PRODUCTOS
 * 
 * Esta página muestra el catálogo completo de obras de arte con capacidades
 * avanzadas de filtrado y búsqueda. Permite a los usuarios explorar productos
 * por diferentes criterios y encontrar obras específicas.
 * 
 * Funcionalidades principales:
 * - Búsqueda por texto en nombres y artistas
 * - Filtrado por categorías, técnica, estilo, artista, etc.
 * - Filtros de acordeón expandibles/colapsables
 * - Integración con URL para compartir búsquedas
 * - Vista responsiva en grid de productos
 * 
 * Dependencias:
 * - ProductContext: Para obtener el catálogo de productos
 * - Categories API: Para cargar las categorías disponibles
 * - React Router: Para manejo de parámetros de URL
 */

import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { categoriesAPI } from '../api/categories'
import { useProducts } from '../context/ProductContext'
import { FaSearch } from "react-icons/fa";
import { textIncludes } from '../utils/textUtils'

export default function CategoriesPage() {
  // Datos del contexto de productos
  const { products, loading } = useProducts()

  // Manejo de parámetros de búsqueda desde la URL (q=busqueda&cat=categoria)
  const [searchParams, setSearchParams] = useSearchParams()
  const [q, setQ] = useState(searchParams.get('q') || '')     // Término de búsqueda
  const [cat, setCat] = useState(searchParams.get('cat') || '') // Categoría seleccionada

  // Lista de categorías obtenidas desde la API
  const [categories, setCategories] = useState([])

  /**
   * ESTADO DE ACORDEONES DE FILTROS
   * 
   * Controla qué secciones de filtros están expandidas o colapsadas.
   * Permite una interfaz más limpia ocultando filtros no utilizados.
   */
  const [expandedFilters, setExpandedFilters] = useState({
    categories: false,   // Filtro por categorías
    technique: false,    // Filtro por técnica artística
    style: false,        // Filtro por estilo
    artist: false,       // Filtro por artista
    dimensions: false,   // Filtro por dimensiones
    pallette: false,     // Filtro por paleta de colores
    price: false         // Filtro por rango de precio
  })

  /**
   * ESTADO DE FILTROS SELECCIONADOS
   * 
   * Almacena los valores activos de cada tipo de filtro.
   * Cada array contiene los valores seleccionados por el usuario.
   */
  const [filters, setFilters] = useState({
    technique: [],       // Técnicas seleccionadas (ej: ['óleo', 'acuarela'])
    style: [],          // Estilos seleccionados (ej: ['abstracto', 'realista'])
    artist: [],         // Artistas seleccionados
    dimensions: [],     // Rangos de dimensiones seleccionados
    pallette: [],       // Paletas de colores seleccionadas
    price: []          // Rangos de precio seleccionados
  })

  /**
   * EFECTO DE CARGA DE CATEGORÍAS
   * 
   * Carga las categorías disponibles desde la API al montar el componente.
   * Estas categorías se usan tanto para filtrado como para navegación.
   */
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoriesAPI.getAll()
        setCategories(data)
      } catch (error) {
        console.error('Error al cargar categorías:', error)
        // En caso de error, mantenemos array vacío
      }
    }
    loadCategories()
  }, [])

  /**
   * EFECTO DE SINCRONIZACIÓN CON URL
   * 
   * Mantiene los parámetros de búsqueda sincronizados con la URL del navegador.
   * Esto permite:
   * - Compartir búsquedas específicas via URL
   * - Navegación con botones atrás/adelante del browser
   * - Bookmarking de búsquedas específicas
   */
  useEffect(() => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)      // Parámetro de búsqueda
    if (cat) params.set('cat', cat) // Parámetro de categoría
    setSearchParams(params)
  }, [q, cat, setSearchParams])

  /**
   * MANEJADOR DE CAMBIOS EN FILTROS DE CHECKBOX
   * 
   * Controla la selección/deselección de opciones en los filtros.
   * Implementa lógica de toggle: si existe lo quita, si no existe lo agrega.
   * 
   * @param {string} filterName - Nombre del tipo de filtro (technique, style, etc.)
   * @param {string} option - Valor específico a agregar/quitar
   */
  const handleFilterChange = (filterName, option) => {
    setFilters(prev => {
      const current = prev[filterName]
      const exists = current.includes(option)
      return {
        ...prev,
        [filterName]: exists
          ? current.filter(item => item !== option) // Si ya estaba, lo removemos
          : [...current, option]                     // Si no estaba, lo agregamos
      }
    })
  }

  /**
   * FUNCIÓN AUXILIAR PARA VALIDACIÓN DE RANGOS DE PRECIO
   * 
   * Verifica si el precio de un producto coincide con alguno de los
   * rangos de precio seleccionados en los filtros.
   * 
   * Maneja dos formatos:
   * - Rangos cerrados: "$0 - $50.000"
   * - Rangos abiertos: "$200.000+"
   * 
   * @param {number} productPrice - Precio del producto a evaluar
   * @param {Array} ranges - Array de strings con rangos seleccionados
   * @returns {boolean} true si el precio coincide con algún rango
   */
  const checkPriceMatch = (productPrice, ranges) => {
    if (!ranges || ranges.length === 0) return true

    return ranges.some(range => {
      if (range.includes('+')) {
        // Formato "$200.000+" - rango abierto hacia arriba
        const min = parseInt(range.replace(/\D/g, ''), 10)
        return productPrice >= min
      } else {
        // Formato "$0 - $50.000" - rango cerrado
        const [minStr, maxStr] = range.replace(/\$/g, '').split('-')
        const min = parseInt(minStr.trim().replace('.', ''), 10)
        const max = parseInt(maxStr.trim().replace('.', ''), 10)
        return productPrice >= min && productPrice <= max
      }
    })
  }

  /**
   * ALGORITMO PRINCIPAL DE FILTRADO DE PRODUCTOS
   * 
   * Aplica todos los filtros de manera secuencial:
   * 1. Búsqueda de texto en múltiples campos
   * 2. Filtro por categoría
   * 3. Filtros específicos (técnica, estilo, artista, etc.)
   * 
   * Optimizado con useMemo para evitar recálculos innecesarios.
   */
  const filtered = useMemo(() => {
    if (!products) return []

    return products
      .filter(p => {
        // PASO 1: BÚSQUEDA DE TEXTO MULTICANAL INTELIGENTE
        // Busca en nombre, artista y descripción del producto con tolerancia a acentos
        const searchableText = (p.name || p.nombreObra || p.nombre || '') + ' ' + 
                               (p.artist || p.artista || '') + ' ' + 
                               (p.description || p.descripcion || '')
        
        const matchText = !q || textIncludes(searchableText, q)
        
        // Debug: Log de búsqueda (solo cuando hay query)
        if (q && p.id === 1) {
          console.log('🔍 Debug búsqueda:', {
            query: q,
            searchableText: searchableText,
            productName: p.name || p.nombreObra,
            productArtist: p.artist || p.artista,
            matchText: matchText
          })
        }

        // PASO 2: VALIDACIONES DE FILTROS INDIVIDUALES
        // Filtro por categoría: cat es un ID, pero categorias es un array de nombres
        // categoriaIds es el array de IDs correspondiente
        const matchCat = !cat || 
          (p.categoriaIds && p.categoriaIds.includes(parseInt(cat))) ||
          (p.categorias && p.categorias.includes(cat)) ||
          p.category === cat
        const matchTechnique = filters.technique.length === 0 || filters.technique.includes(p.tecnica || p.technique)
        const matchStyle = filters.style.length === 0 || filters.style.includes(p.estilo || p.style)
        const matchArtist = filters.artist.length === 0 || filters.artist.includes(p.artista || p.artist)
        const matchSize = filters.dimensions.length === 0 || filters.dimensions.includes(p.dimensiones || p.dimensions)
        const matchPallette = filters.pallette.length === 0 || filters.pallette.includes(p.paleta || p.pallette)
        const matchPrice = filters.price.length === 0 || checkPriceMatch(p.precio || p.price, filters.price)

        // PASO 3: COMBINACIÓN LÓGICA (AND) DE TODOS LOS FILTROS
        const finalMatch = (
          matchText &&
          matchCat &&
          matchTechnique &&
          matchStyle &&
          matchArtist &&
          matchSize &&
          matchPallette &&
          matchPrice
        )
        
        return finalMatch
      })
      
    // Debug: Log de resultados de filtrado
    console.log('🔍 Resultados de búsqueda:', {
      query: q,
      totalProducts: products.length,
      filteredProducts: filteredResults.length
    })
    
    return filteredResults
      .sort((a, b) => {
        // Manejo defensivo para nombres undefined
        const nameA = a.name || a.nombre || 'Sin nombre'
        const nameB = b.name || b.nombre || 'Sin nombre'
        return nameA.localeCompare(nameB)
      }) // Ordenar alfabéticamente por nombre
  }, [q, cat, filters, products]) // Dependencias para recálculo automático

  /**
   * FUNCIÓN PARA LIMPIAR TODOS LOS FILTROS
   * 
   * Resetea el estado de búsqueda y filtros a valores iniciales.
   * Útil para que el usuario pueda empezar una búsqueda desde cero.
   */
  const clearFilters = () => {
    setQ('')     // Limpiar búsqueda de texto
    setCat('')   // Limpiar categoría seleccionada
    setFilters({ // Resetear todos los filtros a arrays vacíos
      technique: [],
      style: [],
      artist: [],
      dimensions: [],
      pallette: [],
      price: []
    })
  }

  /**
   * FUNCIÓN PARA TOGGLE DE ACORDEONES DE FILTROS
   * 
   * Controla la expansión/colapso de las secciones de filtros.
   * Permite una interfaz más limpia ocultando filtros no utilizados.
   * 
   * @param {string} filterName - Nombre del filtro a expandir/colapsar
   */
  const toggleFilter = (filterName) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }))
  }

  /**
   * OPCIONES DE FILTROS DINÁMICAS
   * 
   * Extrae automáticamente las opciones de filtros desde los productos del backend.
   * Se actualiza cuando los productos cambian.
   */
  const filterOptions = useMemo(() => {
    if (!products || products.length === 0) return {}
    
    const extractUniqueValues = (field, isArray = false) => {
      const values = products.flatMap(product => {
        const value = product[field] || product[field.replace('e', 'a')] // técnica/tecnica, etc.
        if (!value) return []
        return isArray ? (Array.isArray(value) ? value : [value]) : [value]
      }).filter(Boolean)
      return [...new Set(values)].sort()
    }
    
    return {
      technique: extractUniqueValues('tecnica'),
      style: extractUniqueValues('estilo'), 
      artist: extractUniqueValues('artista'),
      dimensions: extractUniqueValues('dimensiones'),
      pallette: extractUniqueValues('paleta'),
      price: ['$0 - $50.000', '$50.000 - $100.000', '$100.000 - $200.000', '$200.000+']
    }
  }, [products])

  // ESTADO DE CARGA: Mostrar indicador mientras se obtienen los datos
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
                      value={category.id.toString()}
                      checked={cat === category.id.toString()}
                      onChange={(e) => setCat(e.target.value)}
                    />
                    <span className="filter-option-text">{category.name || category.nombre}</span>
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
      <div className="no-results">
        <p>No se encontraron resultados</p>
        {q && (
          <p>
            No encontramos obras que coincidan con "<strong>{q}</strong>".
            <br />
            Intenta con otros términos como "pintura", "abstracto" o el nombre de un artista.
          </p>
        )}
        {cat && categories.length > 0 && (
          <p>
            No hay obras en la categoría seleccionada.
          </p>
        )}
        <p>Total de productos disponibles: {products?.length || 0}</p>
      </div>
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
