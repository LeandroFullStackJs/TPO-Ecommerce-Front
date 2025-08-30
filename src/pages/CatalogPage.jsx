import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { categoriesAPI } from '../api/categories'
import { useProducts } from '../context/ProductContext'

export default function CatalogPage() {
  const { products, loading } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const [q, setQ] = useState(searchParams.get('q') || '')
  const [cat, setCat] = useState(searchParams.get('cat') || '')
  const [categories, setCategories] = useState([])
  
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
        const matchText = (p.name + ' ' + p.artist + ' ' + p.description)
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

  if (loading) {
    return (
      <section className="section">
        <div className="section-header">
          <h1 className="section-title">Catálogo de Productos</h1>
          <p className="section-subtitle">Cargando productos...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="section-header">
        <h1 className="section-title">Galería de Arte</h1>
        <p className="section-subtitle">
          Explora nuestra completa colección de obras de arte contemporáneo
        </p>
      </div>

      <div className="filters">
        <div className="search-container">
          <div className="search-icon">🔍</div>
          <input 
            className="search-input"
            placeholder="Buscar obras, artistas o estilos..." 
            value={q} 
            onChange={e => setQ(e.target.value)}
          />
        </div>
        
        <select 
          className="category-filter"
          value={cat} 
          onChange={e => setCat(e.target.value)}
        >
          <option value="">Todos los estilos</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {(q || cat) && (
          <button 
            className="btn btn-outline btn-sm"
            onClick={clearFilters}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          background: 'var(--light-gray)',
          borderRadius: 'var(--border-radius)'
        }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-light)' }}>
            No se encontraron obras
          </h3>
          <p style={{ color: 'var(--text-light)' }}>
            Intenta ajustar tus filtros de búsqueda
          </p>
        </div>
      ) : (
        <>
          <div style={{ 
            marginBottom: '2rem', 
            color: 'var(--text-light)',
            fontSize: '0.95rem'
          }}>
            Mostrando {filtered.length} obra{filtered.length !== 1 ? 's' : ''}
            {q && ` para "${q}"`}
            {cat && ` en ${categories.find(c => c.id === cat)?.name}`}
          </div>
          
          <div className="products-grid">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </>
      )}
    </section>
  )
}

