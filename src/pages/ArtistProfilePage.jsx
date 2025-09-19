import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import ProductCard from '../components/ProductCard'
import { categoriesAPI } from '../api/categories'
import axios from 'axios'

export default function ArtistProfilePage() {
  const { artistId } = useParams()
  const { products, loading: productsLoading } = useProducts()
  const [artist, setArtist] = useState(null)
  const [artistLoading, setArtistLoading] = useState(true)

  const [categories, setCategories] = useState([])
  
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
      return category ? category.name : categoryId
    }

  useEffect(() => {
    const fetchArtistData = async () => {
      if (!artistId) return
      setArtistLoading(true)
      try {
        // 1. Fetch artist details from the API
        const artistResponse = await axios.get(`http://localhost:5000/artists/${artistId}`)
        const artistData = artistResponse.data

        // 2. Filter products for this artist (once products are loaded)
        if (!productsLoading && products.length > 0) {
          const artistWorks = products.filter(p => p.artistId == artistId) // Use == for type coercion

          // 3. Combine data and set state
          setArtist({
            ...artistData, // Use real data from API (name, bio, profileImage)
            works: artistWorks,
            category: artistWorks.length > 0 ? artistWorks[0].category : 'unknown',
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
      <div className="artist-header" style={{ backgroundImage: `url(${artist.coverImage})` }}>
        <div className="artist-header-content">
          <img 
            src={artist.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&size=200`} 
            alt={artist.name}
            className="artist-profile-avatar"
          />
          <h1>{artist.name}</h1>
          <p className="artist-category">{getCategoryName(artist.category)}</p>
          
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
        </div>
      </div>

      <div className="artist-content">
        <section className="artist-bio">
          <h2>Biografía</h2>
          <p>{artist.biography}</p>
        </section>

        <section className="artist-statement">
          <h2>Statement Artístico</h2>
          <p>{artist.statement}</p>
        </section>

        <section className="artist-works">
          <h2>Obras Disponibles</h2>
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
