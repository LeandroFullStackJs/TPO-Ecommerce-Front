import { Link } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import { categoriesAPI } from '../api/categories'
import ProductCard from '../components/ProductCard'
import ArtistCard from '../components/ArtistCard' // Importar ArtistCard
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

  // Procesar artistas a partir de los productos
  const featuredArtists = products
    ? Object.values(
        products.reduce((acc, product) => {
          if (!acc[product.artist]) {
            acc[product.artist] = {
              id: product.artist.toLowerCase().replace(/\s+/g, '-'),
              name: product.artist,
              category: product.category,
              works: [],
              profileImage: null
            }
          }
          acc[product.artist].works.push(product)
          return acc
        }, {})
      ).slice(0, 6)
    : []

  // Función para obtener el nombre de la categoría
  const getCategoryName = categoryId => {
    const category = categories.find(c => c.id === categoryId)
    return category ? category.name : 'Sin categoría'
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
          <Link className="btn btn-primary btn-lg" to="/catalogo">
            Explorar Obras de Arte
          </Link>
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

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link className="btn btn-outline btn-lg" to="/catalogo">
            Ver Toda la Colección
          </Link>
        </div>
      </section>

      


      <section className="featured section">
        <div className="section-header">
          <h2 className="section-title">Artistas Destacados</h2>
          <p className="section-subtitle">
            Descubre a los talentos detrás de nuestras obras
          </p>
        </div>
        <Swiper
          modules={[Navigation, Pagination]}
          className="artist-carousel" /* Clase para estilos custom */
          spaceBetween={50}
          slidesPerView={3}
          centeredSlides={true}
          navigation
          pagination={{ clickable: true }}
          loop={true}
        >
          {featuredArtists.map(artist => (
            <SwiperSlide key={artist.id}>
              <ArtistCard artist={artist} getCategoryName={getCategoryName} />
            </SwiperSlide>
          ))}
        </Swiper>
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