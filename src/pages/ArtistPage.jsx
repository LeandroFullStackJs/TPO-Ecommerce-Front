import { useState, useEffect, useMemo } from 'react'
import ArtistCard from '../components/ArtistCard'
import { useProducts } from '../context/ProductContext'
import { categoriesAPI } from '../api/categories'

export default function ArtistPage() {
  const { products, loading } = useProducts()
  const [filter, setFilter] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState([])

  // Obtener artistas únicos de los productos
  const artists = [...new Map(
    products.map(product => [
      product.artist,
      {
        id: product.id.split('-')[0],
        name: product.artist,
        category: product.category,
        works: products.filter(p => p.artist === product.artist)
      }
    ])
  ).values()]

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

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  // Filtrar artistas según búsqueda y categoría
  const filteredArtists = useMemo(() => {
    return artists.filter(artist => {
      const matchesSearch = artist.name.toLowerCase().includes(filter.toLowerCase())
      const matchesCategory = !selectedCategory || artist.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [artists, filter, selectedCategory])

  const clearFilters = () => {
    setFilter('')
    setSelectedCategory('')
  }

  if (loading) {
    return (
      <section className="section">
        <div className="section-header">
          <h1 className="section-title">Nuestros Artistas</h1>
          <p className="section-subtitle">Cargando artistas...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="section-header">
        <h1 className="section-title">Nuestros Artistas</h1>
        <p className="section-subtitle">
          Descubre talentosos artistas contemporáneos y sus obras únicas
        </p>
      </div>

      <div className="filters">
        <div className="search-container">
          <div className="search-icon">🔍</div>
          <input 
            className="search-input"
            placeholder="Buscar por nombre de artista..." 
            value={filter} 
            onChange={e => setFilter(e.target.value)}
          />
        </div>
        
        <select 
          className="category-filter"
          value={selectedCategory} 
          onChange={e => setSelectedCategory(e.target.value)}
        >
          <option value="">Todos los estilos</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {(filter || selectedCategory) && (
          <button 
            className="btn btn-outline btn-sm"
            onClick={clearFilters}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {filteredArtists.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          background: 'var(--light-gray)',
          borderRadius: 'var(--border-radius)'
        }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-light)' }}>
            No se encontraron artistas
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
            Mostrando {filteredArtists.length} artista{filteredArtists.length !== 1 ? 's' : ''}
            {filter && ` para "${filter}"`}
            {selectedCategory && ` en ${categories.find(c => c.id === selectedCategory)?.name}`}
          </div>
          
          <div className="artists-grid">
            {filteredArtists.map(artist => (
              <ArtistCard key={artist.id} artist={artist} getCategoryName={getCategoryName} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
