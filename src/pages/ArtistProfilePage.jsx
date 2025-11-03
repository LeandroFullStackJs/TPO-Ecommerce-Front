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
        if (!artistId) return;
        setArtistLoading(true);

        try {
          const artistData = await artistsAPI.getById(artistId);

          // --- DEBUGGING ---
          console.log("ID de artista de la URL:", artistId, typeof artistId);
          if (products.length > 0) {
            console.log("Primer producto en la lista:", products[0]);
            console.log("ID de artista en el primer producto:", products[0].artistaId, typeof products[0].artistaId);
          }
          // --- FIN DEBUGGING ---

          // Filtra usando una comparación más segura
          const artistWorks = products.filter(
            p => p.artistaId === parseInt(artistId, 10)
          );
          
          console.log("Obras encontradas para este artista:", artistWorks);

          setArtist({
            id: artistData.id,
            nombre: artistData.nombre,
            biografia: artistData.biografia,
            imagenPerfil: getImageUrl(artistData.imagenPerfil),
            works: artistWorks, // Asignar las obras filtradas
            category: artistWorks.length > 0 && artistWorks[0].categoriaIds && artistWorks[0].categoriaIds.length > 0 
              ? artistWorks[0].categoriaIds[0] 
              : 8,
          });

        } catch (error) {
          console.error('Error al cargar el perfil del artista:', error);
          setArtist(null);
        } finally {
          setArtistLoading(false);
        }
      };

      if (!productsLoading) {
        fetchArtistData();
      }
    }, [artistId, productsLoading]);


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
        {artist.biografia && (
          <section className="artist-section">
            <h2 className="section-title-small">Biografía</h2>
            <p className="artist-text">{artist.biografia}</p>
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
