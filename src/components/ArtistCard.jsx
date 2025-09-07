import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

export default function ArtistCard({ artist, getCategoryName }) {
  // Usamos un avatar genérico como fallback si no hay imagen de perfil.
  const profileImage = artist.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&size=160&background=f8f9fa&color=2c3e50`

  return (
    <div className="artist-card">
      <div className="artist-card-header">
        <img
          src={profileImage}
          alt={artist.name}
          className="artist-card-avatar"
        />
      </div>
      <div className="artist-card-body">
        <h3 className="artist-name">{artist.name}</h3>
        <p className="artist-category">{getCategoryName(artist.category)}</p>

        <div className="artist-card-stats">
          {artist.works.length} obra{artist.works.length !== 1 ? 's' : ''} en la galería
        </div>

        <div className="artist-card-actions">
          <Link to={`/artists/${artist.id}`} className="btn btn-outline btn-sm">
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
    works: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
  getCategoryName: PropTypes.func.isRequired,
}