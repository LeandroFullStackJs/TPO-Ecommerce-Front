import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { categoriesAPI } from '../api/categories'

export default function ArtistCard({ artist }) {
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

  // Array de imágenes aleatorias de artistas trabajando
  const artistImages = [
    'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1513364389922-6912e1904421?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1579762593131-b8945254345c?w=800&h=600&fit=crop'
  ]

  // Seleccionar una imagen aleatoria basada en el ID del artista
  const randomImage = artistImages[parseInt(artist.id.charAt(0), 36) % artistImages.length]

  return (
    <div className="artist-card">
      <div className="card-section image-section">
        <div className="artist-image-container">
          <img 
            src={artist.profileImage || randomImage}
            alt={artist.name}
            className="artist-avatar"
          />
        </div>
      </div>

      <div className="card-section info-section">
        <div className="info-card main-info">
          <h3 className="artist-name">{artist.name}</h3>
          <span className="artist-discipline">{getCategoryName(artist.category)}</span>
        </div>
        
        <div className="info-card stats-card">
          <h4 className="card-title">Información del Artista</h4>
          <div className="artist-stats">
            <span className="artist-stat">
              <i>🎨</i> {artist.works.length} obras en galería
            </span>
            <span className="artist-stat">
              <i>🏆</i> Artista destacado
            </span>
          </div>
        </div>


        <div className="info-card action-card">
          <Link to={`/artists/${artist.id}`} className="btn btn-primary btn-lg">
            Ver Perfil Completo
          </Link>
        </div>
      </div>
    </div>
  )
}

ArtistCard.propTypes = {
  artist: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    profileImage: PropTypes.string,
    works: PropTypes.arrayOf(PropTypes.object).isRequired
  }).isRequired
}