import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

export default function ArtistCard({ artist = {}, getCategoryName }) {
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

  // Normalización defensiva del artista
  const normalizedArtist = {
    id: artist?.id || 'unknown',
    name: artist?.name || artist?.nombre || 'Artista Sin Nombre',
    category: artist?.category || artist?.categoria || 'Sin Categoría',
    profileImage: getImageUrl(artist?.profileImage || artist?.imagenPerfil || artist?.image),
    works: Array.isArray(artist?.works) ? artist.works : []
  }

  // Usamos un avatar genérico como fallback si no hay imagen de perfil.
  const profileImage = normalizedArtist.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(normalizedArtist.name)}&size=160&background=f8f9fa&color=2c3e50`

  return (
    <div className="artist-card">
      <div className="artist-card-header">
        <img
          src={profileImage}
          alt={normalizedArtist.name}
          className="artist-card-avatar"
        />
      </div>
      <div className="artist-card-body">
        <h3 className="artist-name">{normalizedArtist.name}</h3>
        <p className="artist-category">{getCategoryName(normalizedArtist.category)}</p>

        <div className="artist-card-stats">
          {normalizedArtist.works.length} obra{normalizedArtist.works.length !== 1 ? 's' : ''} en la galería
        </div>

        <div className="artist-card-actions">
          <Link to={`/artists/${normalizedArtist.id}`} className="btn btn-outline btn-sm">
            Ver Perfil Completo 
          </Link>
        </div>
      </div>
    </div>
  )
}

ArtistCard.propTypes = {
  artist: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    nombre: PropTypes.string, // Alternativa española
    category: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Aceptar ambos tipos
    categoria: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Alternativa española
    profileImage: PropTypes.string,
    imagenPerfil: PropTypes.string, // Alternativa española
    image: PropTypes.string, // Campo adicional
    works: PropTypes.array,
  }),
  getCategoryName: PropTypes.func.isRequired,
}