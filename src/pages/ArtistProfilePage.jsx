import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import ProductCard from '../components/ProductCard'
import { categoriesAPI } from '../api/categories'

export default function ArtistProfilePage() {
  const { artistId } = useParams()
  const { products } = useProducts()
  const [artist, setArtist] = useState(null)
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

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : 'Categoría desconocida';
  };
  

  useEffect(() => {
    // Encontrar todas las obras del artista
    const artistWorks = products.filter(p => p.id.split('-')[0] === artistId)
    
    if (artistWorks.length > 0) {
      // Crear el objeto del artista con la primera obra
      const firstWork = artistWorks[0]
      setArtist({
        id: artistId,
        name: firstWork.artist,
        category: firstWork.category,
        works: artistWorks,
        // Estos datos deberían venir de una API real
        biography: "Artista contemporáneo con una trayectoria destacada en el mundo del arte...",
        statement: "Mi obra busca expresar la conexión entre la naturaleza y la experiencia humana...",
        coverImage: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&h=400&fit=crop",
      })
    }
  }, [artistId, products])

  if (!artist) {
    return <div className="loading">Cargando perfil del artista...</div>
  }

  return (
    <div className="artist-profile">
      <div className="artist-header" style={{ backgroundImage: `url(${artist.coverImage})` }}>
        <div className="artist-header-content">
          <img 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&size=200`} 
            alt={artist.name}
            className="artist-profile-avatar"
          />
          <h1>{artist.name}</h1>
          <p className="artist-category">{getCategoryName(artist.category)}</p>
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
