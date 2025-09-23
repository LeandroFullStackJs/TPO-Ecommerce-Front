/**
 * PÁGINA DE INICIO - PANTALLA PRINCIPAL DE LA GALERÍA DE ARTE
 * 
 * Esta página sirve como el punto de entrada principal de la aplicación.
 * Muestra una vista atractiva y funcional que invita a los usuarios a explorar
 * la galería de arte y descubrir nuevas obras y artistas.
 * 
 * Funcionalidades principales:
 * - Hero section con buscador prominente
 * - Carrusel de productos destacados usando Swiper.js
 * - Grid de categorías de arte para navegación rápida
 * - Sección de artistas destacados
 * - Diseño responsivo y optimizado para conversión
 * 
 * Librerías externas utilizadas:
 * - Swiper.js para carruseles interactivos
 * - React Router para navegación
 */

import { Link, useNavigate } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import { categoriesAPI } from '../api/categories'
import { artistsAPI } from '../api/artists'
import { heroAPI } from '../api/hero'
import ProductCard from '../components/ProductCard'
import ArtistCard from '../components/ArtistCard' // Importar ArtistCard
import { useState, useEffect, useMemo } from 'react'

// Importar Swiper.js para carruseles
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'

export default function HomePage() {
  // Estados del contexto de productos
  const { products, loading } = useProducts()
  
  // Estados locales para gestión de datos de la página
  const [artists, setArtists] = useState([])                    // Lista de artistas destacados
  const [artistsLoading, setArtistsLoading] = useState(true)    // Estado de carga de artistas
  const [categories, setCategories] = useState([])             // Lista de categorías de arte
  const [categoriesLoading, setCategoriesLoading] = useState(true) // Estado de carga de categorías
  const [heroImages, setHeroImages] = useState([])             // Imágenes para el carrusel hero
  const [heroImagesLoading, setHeroImagesLoading] = useState(true) // Estado de carga del hero
  const [searchQuery, setSearchQuery] = useState('')           // Término de búsqueda del usuario
  const navigate = useNavigate()

  /**
   * EFECTO DE CARGA DE CATEGORÍAS
   * 
   * Carga las categorías disponibles desde la API al montar el componente.
   * Las categorías se usan para mostrar opciones de navegación rápida
   * en la sección de exploración por tipos de arte.
   * 
   * Se ejecuta una sola vez al montar el componente.
   */
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoriesAPI.getAll()
        setCategories(data)
      } catch (error) {
        console.error('Error al cargar categorías:', error)
        // En caso de error, mantenemos array vacío para evitar crashes
      } finally {
        setCategoriesLoading(false)
      }
    }
    loadCategories()
  }, [])

  /**
   * EFECTO DE CARGA DE ARTISTAS
   * 
   * Obtiene la lista de artistas destacados desde la API.
   * Estos artistas se muestran en la sección de "Artistas Destacados"
   * para dar visibilidad a los creadores de las obras.
   * 
   * Se ejecuta una sola vez al montar el componente.
   */
  useEffect(() => {
    const loadArtists = async () => {
      try {
        const data = await artistsAPI.getAll()
        setArtists(data)
      } catch (error) {
        console.error('Error al cargar artistas:', error)
        setArtists([]) // Array vacío en caso de error para mejor UX
      } finally {
        setArtistsLoading(false)
      }
    }
    loadArtists()
  }, [])

  // Cargar imágenes del hero desde la API
  /**
   * EFECTO DE CARGA DE IMÁGENES HERO
   * 
   * Carga las imágenes para el carrusel principal (hero section).
   * Estas imágenes se rotan automáticamente para mostrar contenido
   * visual atractivo en la parte superior de la página.
   * 
   * Se ejecuta una sola vez al montar el componente.
   */
  useEffect(() => {
    const loadHeroImages = async () => {
      try {
        const data = await heroAPI.getHeroImages()
        setHeroImages(data)
      } catch (error) {
        console.error('Error al cargar imágenes del hero:', error)
        setHeroImages([]) // Array vacío en caso de error para mejor UX
      } finally {
        setHeroImagesLoading(false)
      }
    }
    loadHeroImages()
  }, [])

  /**
   * ARTISTAS DESTACADOS CON SUS OBRAS
   * 
   * Calcula los artistas destacados combinando datos de artistas con sus obras.
   * 
   * Lógica de procesamiento:
   * 1. Mapea cada artista y encuentra sus obras en el catálogo
   * 2. Asigna categoría principal basada en la primera obra
   * 3. Ordena por cantidad de obras (más productivos primero)
   * 4. Limita a los 6 artistas más destacados
   * 
   * Usa useMemo para optimizar el cálculo y evitar recálculos
   * innecesarios cuando no cambian las dependencias.
   */
  const featuredArtists = useMemo(() => {
    // Si aún está cargando, retorna array vacío
    if (artistsLoading || loading) return []

    // Mapear artistas y añadir información de sus obras
    const artistsWithWorks = artists.map(artist => {
      const works = products.filter(p => p.artistId === artist.id)
      const primaryCategory = works.length > 0 ? works[0].category : 'unknown'
      return {
        ...artist,
        works,                    // Array de obras del artista
        category: primaryCategory  // Categoría principal del artista
      }
    })

    // Ordenar por cantidad de obras y tomar los 6 primeros
    return artistsWithWorks
      .sort((a, b) => b.works.length - a.works.length)  // Más obras primero
      .slice(0, 6)                                       // Máximo 6 artistas
  }, [artists, products, artistsLoading, loading])

  /**
   * OBTENER NOMBRE DE CATEGORÍA
   * 
   * Función helper para obtener el nombre legible de una categoría
   * basado en su ID. Útil para mostrar etiquetas amigables al usuario.
   * 
   * @param {string} categoryId - ID de la categoría
   * @returns {string} Nombre de la categoría o texto por defecto
   */
  const getCategoryName = categoryId => {
    const category = categories.find(c => c.id === categoryId)
    return category ? category.name : 'Sin categoría'
  }

  /**
   * MANEJAR BÚSQUEDA
   * 
   * Procesa el envío del formulario de búsqueda y navega
   * a la página de resultados con el término ingresado.
   */
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/categorias?q=${encodeURIComponent(searchQuery.trim())}`) // Cambiado a /categorias
    }
  }

  // Obtener productos destacados (con stock disponible)
  const featuredProducts = products?.filter(p => p.stock > 0).slice(0, 6) || []

  if (loading || categoriesLoading || heroImagesLoading || artistsLoading) {
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
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          className="hero-swiper"
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false
          }}
          pagination={{ clickable: true }}
          navigation={true}
        >
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
          {heroImages.map((image) => (
            <SwiperSlide key={image.id}>
              <div className="hero-slide-image" style={{ backgroundImage: `url(${image.src})` }} aria-label={image.alt} />
            </SwiperSlide>
          ))}
        </Swiper>
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
          spaceBetween={30}
          slidesPerView={3}
          navigation
          loop={true}
          pagination={{ clickable: true }}
          breakpoints={{
            320: { 
              slidesPerView: 1,
              spaceBetween: 20,
              centeredSlides: true 
            },
            640: { 
              slidesPerView: 2,
              spaceBetween: 25,
              centeredSlides: false 
            },
            1024: { 
              slidesPerView: 3,
              spaceBetween: 30,
              centeredSlides: false 
            }
          }}
        >
          {featuredProducts.map(p => (
            <SwiperSlide key={p.id}>
              <ProductCard product={p} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link className="btn btn-outline btn-lg" to="/categorias"> {/* Cambiado a /categorias */}
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
          className="artist-carousel"
          spaceBetween={40}
          slidesPerView={3}
          centeredSlides={true}
          navigation
          pagination={{ clickable: true }}
          loop={true}
          breakpoints={{
            320: { 
              slidesPerView: 1,
              spaceBetween: 20,
              centeredSlides: true 
            },
            640: { 
              slidesPerView: 2,
              spaceBetween: 30,
              centeredSlides: false 
            },
            900: { 
              slidesPerView: 2,
              spaceBetween: 35,
              centeredSlides: true 
            },
            1024: { 
              slidesPerView: 3,
              spaceBetween: 40,
              centeredSlides: true 
            }
          }}
        >
          {featuredArtists.map(artist => (
            <SwiperSlide key={artist.id}>
              <ArtistCard artist={artist} getCategoryName={getCategoryName} />
            </SwiperSlide>
          ))}
        </Swiper>
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link className="btn btn-outline btn-lg" to="/artistas">
            Ver todos los artistas
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
          {categories.slice(0, 8).map(category => {
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
              <Link key={category.id} to={`/categorias?cat=${category.id}`} className="category-card"> {/* Cambiado a /categorias */}
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