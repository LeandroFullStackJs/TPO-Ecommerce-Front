import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import ProductCard from '../components/ProductCard'
import '../styles/ArtistProfilePage.css'
import { categoriesAPI } from '../api/categories'
import { artistsAPI } from '../api/artists'

export default function ArtistProfilePage() {
  const { artistId } = useParams()
  const { products, loading: productsLoading } = useProducts()
  const [artist, setArtist] = useState(null)
  const [artistLoading, setArtistLoading] = useState(true)

  const [categories, setCategories] = useState([])

  // Función helper para manejar URLs de imagen del backend
  function getImageUrl(imageUrl) {
    if (!imageUrl) return null
    
    // Si la URL es relativa (viene del proxy del backend), añadir base URL
    if (imageUrl.startsWith('/api/')) {
      return `http://localhost:8080${imageUrl}`
    }
    
    // Si es URL absoluta, usarla directamente
    return imageUrl
  }
  
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const data = await categoriesAPI.getAll()
          setCategories(data)
        } catch (error) {
          console.error('Error fetching categories:', error)
        }
      }
  
      fetchCategories()
    }, [])
  
    const getCategoryName = (categoryId) => {
      const category = categories.find((c) => c.id === categoryId)
      return category ? (category.name || category.nombre) : 'Sin Categoría'
    }

  useEffect(() => {
    const fetchArtistData = async () => {
      if (!artistId) return
      setArtistLoading(true)
      try {
        // 1. Fetch artist details from the API
        const artistData = await artistsAPI.getById(artistId)

        // 2. Filter products for this artist (once products are loaded)
        if (!productsLoading && products.length > 0) {
          const artistWorks = products.filter(p => 
            p.artistId == artistId || p.artistaId == artistId || 
            (p.artista || p.artist) === artistData.nombre || 
            (p.artista || p.artist) === artistData.name
          ) // Support multiple field mappings

          // 3. Combine data and set state
          setArtist({
            ...artistData, // Use real data from API (name, bio, profileImage)
            // Normalize artist name
            name: artistData.name || artistData.nombre || 'Artista Sin Nombre',
            // Normalize profile image
            profileImage: getImageUrl(artistData.profileImage || artistData.imagenPerfil || artistData.imagen),
            works: artistWorks,
            category: artistWorks.length > 0 && artistWorks[0].categoriaIds && artistWorks[0].categoriaIds.length > 0 
              ? artistWorks[0].categoriaIds[0] 
              : 8, // Default to "Arte Contemporáneo"
            coverImage: artistData.coverImage || "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&h=400&fit=crop",
          })
        }
      } catch (error) {
        console.error('Error al cargar el perfil del artista:', error)
        setArtist(null) // Set to null on error
      } finally {
        setArtistLoading(false)
      }
    }

    // Run fetch only when products are not loading to ensure works are available
    if (!productsLoading) {
      fetchArtistData()
    }
  }, [artistId, products, productsLoading])

  if (artistLoading || productsLoading) {
    return <div className="loading">Cargando perfil del artista...</div>
  }

  if (!artist) {
    return <div className="loading">No se encontró el perfil del artista.</div>
  }

  return (
    <div className="artist-profile">
      <section className="artist-profile-header">
        <div className="artist-info">
          <img 
            src={getImageUrl(artist.profileImage || artist.imagenPerfil) || `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name || artist.nombre)}&size=200`} 
            alt={artist.name || artist.nombre}
            className="artist-avatar"
          />
          <h1 className="artist-name">{artist.name || artist.nombre}</h1>
          <p className="artist-category">{getCategoryName(artist.category)}</p>
          
          {artist.socialLinks && (
            <div className="social-links">
              {artist.socialLinks?.instagram && (
                <a href={artist.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              )}
              {artist.socialLinks?.twitter && (
                <a href={artist.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="artist-content">
        {artist.biography && (
          <section className="artist-section">
            <h2 className="section-title-small">Biografía</h2>
            <p className="artist-text">{artist.biography}</p>
          </section>
        )}

        {artist.statement && (
          <section className="artist-section">
            <h2 className="section-title-small">Statement Artístico</h2>
            <p className="artist-text">{artist.statement}</p>
          </section>
        )}

        <section className="artist-section">
          <h2 className="section-title-small">Obras Disponibles</h2>
          <div className="products-grid">
            {artist.works.map(work => (
              <ProductCard key={work.id} product={work} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
