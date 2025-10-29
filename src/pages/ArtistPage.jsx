import { useState, useEffect, useMemo } from 'react'
import ArtistCard from '../components/ArtistCard'
import { useProducts } from '../context/ProductContext'
import { categoriesAPI } from '../api/categories'
import { artistsAPI } from '../api/artists'

export default function ArtistPage() {
  const { products, loading: productsLoading } = useProducts()
  const [artists, setArtists] = useState([])
  const [artistsLoading, setArtistsLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState([])

  // Cargar artistas desde la API
  useEffect(() => {
    const loadArtists = async () => {
      try {
        const data = await artistsAPI.getAll()
        // Validar que data sea un array
        setArtists(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error al cargar artistas:', error)
        setArtists([]) // Set empty array on error for better UX
      } finally {
        setArtistsLoading(false)
      }
    }
    loadArtists()
  }, [])

  // Cargar categorías
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoriesAPI.getAll()
        // Validar que data sea un array
        setCategories(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error al cargar categorías:', error)
        setCategories([]) // Set empty array on error for better UX
      }
    }
    loadCategories()
  }, [])

  // Combinar artistas con sus obras
  const allArtistsWithWorks = useMemo(() => {
    if (artistsLoading || productsLoading) return []

    return artists.map(artist => {
      // Normalizar datos del artista para manejar diferentes estructuras del backend
      const normalizedArtist = {
        ...artist,
        // Asegurar que siempre tengamos un nombre válido
        name: artist.name || artist.nombre || artist.fullName || 'Artista sin nombre',
        // Asegurar que tengamos una imagen por defecto
        image: artist.image || artist.foto || artist.avatar || '/default-artist.jpg',
        // Normalizar descripción/biografía
        bio: artist.bio || artist.biografia || artist.description || '',
      }

      const works = products.filter(p => p.artistId === artist.id)
      const primaryCategory = works.length > 0 ? works[0].category : 'unknown'
      
      return {
        ...normalizedArtist,
        works,
        category: primaryCategory
      }
    })
  }, [artists, products, artistsLoading, productsLoading])

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : 'Categoría desconocida';
  };

  // Filtrar artistas según búsqueda y categoría
  const filteredArtists = useMemo(() => {
    return allArtistsWithWorks.filter(artist => {
      // Usar el nombre normalizado que ya está garantizado que existe
      const matchesSearch = artist.name.toLowerCase().includes(filter.toLowerCase())
      const matchesCategory = !selectedCategory || artist.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [allArtistsWithWorks, filter, selectedCategory])

  const clearFilters = () => {
    setFilter('')
    setSelectedCategory('')
  }

  const loading = artistsLoading || productsLoading
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
