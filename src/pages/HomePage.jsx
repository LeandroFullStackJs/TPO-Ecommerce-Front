import { Link, useNavigate } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import { categoriesAPI } from '../api/categories'
import ProductCard from '../components/ProductCard'
import { useState, useEffect } from 'react'

// Importar Swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function HomePage() {
  const { products, loading } = useProducts()
  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  // Cargar categorías desde la API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoriesAPI.getAll()
        setCategories(data)
      } catch (error) {
        console.error('Error al cargar categorías:', error)
      } finally {
        setCategoriesLoading(false)
      }
    }
    loadCategories()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/catalogo?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  // Obtener productos destacados (con stock disponible)
  const featuredProducts = products?.filter(p => p.stock > 0).slice(0, 6) || []

  if (loading || categoriesLoading) {
    return (
      <section className="hero">
        <div className="hero-content">
          <h1>ArtGallery</h1>
          <p>Cargando obras de arte...</p>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>ArtGallery</h1>
          <p>Descubre obras de arte únicas creadas por artistas contemporáneos. Cada pieza cuenta una historia y transforma espacios.</p>
          <form onSubmit={handleSearch} className="hero-search">
            <div className="search-container">
              <div className="search-icon">🔍</div>
              <input
                className="search-input"
                placeholder="Buscar obras, artistas o estilos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg">Buscar</button>
          </form>
        </div>
      </section>

      <section className="featured section">
        <div className="section-header">
          <h2 className="section-title">Obras Destacadas</h2>
          <p className="section-subtitle">
            Las obras más populares y apreciadas de nuestra galería
          </p>
        </div>

        {/* Carrusel de productos */}
        <Swiper
          className="featured-products-swiper"
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={3}
          navigation
          loop={true}
          pagination={{ clickable: true }}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
        >
          {featuredProducts.map(p => (
            <SwiperSlide key={p.id}>
              <ProductCard product={p} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="view-all-link">
          <Link className="btn btn-outline btn-lg" to="/catalogo">
            Ver Toda la Colección
          </Link>
        </div>
      </section>

      <section className="categories section">
        <div className="section-header">
          <h2 className="section-title">Estilos Artísticos</h2>
          <p className="section-subtitle">
            Explora diferentes estilos y técnicas artísticas en nuestra colección
          </p>
        </div>
        <div className="categories-grid">
          {categories.map(category => {
            const icons = {
              abstract: '🎨',
              landscape: '🌄',
              portrait: '👤',
              geometric: '📐',
              nature: '🌿',
              minimalist: '⚪',
              contemporary: '🖼️',
              textured: '🎭'
            }

            return (
              <Link key={category.id} to={`/catalogo?cat=${category.id}`} className="category-card">
                <div className="category-icon">{icons[category.id] || '🎨'}</div>
                <h3>{category.name}</h3>
                <p>Explorar obras</p>
              </Link>
            )
          })}
        </div>
      </section>
    </>
  )
}