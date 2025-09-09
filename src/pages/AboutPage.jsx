export default function AboutPage() {
  return (
    <div className="about-page">
      <div className="section">
        <div className="section-header">
          <h1 className="section-title">Sobre ArtGallery</h1>
          <p className="section-subtitle">
            Conectando artistas con amantes del arte desde 2020
          </p>
        </div>

        <div className="about-content">
          <div className="about-section">
            <h2>Nuestra Historia</h2>
            <p>
              ArtGallery nació de la pasión por democratizar el acceso al arte. En 2020, un grupo de 
              entusiastas del arte se dio cuenta de que muchos artistas talentosos luchaban por encontrar 
              una plataforma para mostrar y vender sus obras, mientras que los coleccionistas tenían 
              dificultades para descubrir nuevos talentos.
            </p>
            <p>
              Desde entonces, hemos crecido hasta convertirnos en una de las galerías online más 
              importantes de América Latina, conectando a más de 500 artistas con miles de coleccionistas 
              y amantes del arte en todo el mundo.
            </p>
          </div>

          <div className="about-section">
            <h2>Nuestra Misión</h2>
            <p>
              Creemos que el arte tiene el poder de transformar vidas, inspirar mentes y conectar culturas. 
              Nuestra misión es crear un espacio donde los artistas puedan prosperar y donde cualquier 
              persona pueda descubrir y adquirir obras de arte excepcionales.
            </p>
            <div className="mission-points">
              <div className="mission-point">
                <h4>🎨 Para Artistas</h4>
                <p>Proporcionamos una plataforma profesional donde los artistas pueden mostrar su trabajo, 
                contar su historia y conectar directamente con coleccionistas interesados.</p>
              </div>
              <div className="mission-point">
                <h4>🖼️ Para Coleccionistas</h4>
                <p>Ofrecemos acceso a una cuidadosa selección de obras originales, con información 
                detallada sobre cada pieza y su creador.</p>
              </div>
              <div className="mission-point">
                <h4>🌎 Para la Comunidad</h4>
                <p>Fomentamos la apreciación del arte y apoyamos el desarrollo de la escena artística 
                contemporánea.</p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>Nuestros Valores</h2>
            <div className="values-grid">
              <div className="value-item">
                <h4>Autenticidad</h4>
                <p>Todas nuestras obras son originales y vienen con certificado de autenticidad.</p>
              </div>
              <div className="value-item">
                <h4>Calidad</h4>
                <p>Curamos cuidadosamente cada obra para mantener los más altos estándares.</p>
              </div>
              <div className="value-item">
                <h4>Transparencia</h4>
                <p>Proporcionamos información completa sobre cada obra y artista.</p>
              </div>
              <div className="value-item">
                <h4>Accesibilidad</h4>
                <p>Hacemos que el arte sea accesible para todos, independientemente de su presupuesto.</p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>Nuestro Equipo</h2>
            <p>
              Nuestro equipo está compuesto por curadores, historiadores del arte, tecnólogos y 
              apasionados del arte que trabajan incansablemente para ofrecer la mejor experiencia 
              tanto a artistas como a coleccionistas.
            </p>
            <div className="team-stats">
              <div className="stat">
                <h3>500+</h3>
                <p>Artistas Activos</p>
              </div>
              <div className="stat">
                <h3>2,000+</h3>
                <p>Obras Vendidas</p>
              </div>
              <div className="stat">
                <h3>15+</h3>
                <p>Países Representados</p>
              </div>
              <div className="stat">
                <h3>4.8★</h3>
                <p>Calificación Promedio</p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>Nuestras Categorías</h2>
            <p>
              Trabajamos con una amplia variedad de estilos y medios artísticos para asegurar que 
              cada visitante encuentre algo que resuene con su gusto personal:
            </p>
            <div className="categories-list">
              <div className="category-item">
                <strong>Pintura:</strong> Desde óleos clásicos hasta acrílicos contemporáneos
              </div>
              <div className="category-item">
                <strong>Dibujo:</strong> Grafito, carboncillo, tinta y técnicas mixtas
              </div>
              <div className="category-item">
                <strong>Escultura:</strong> Piezas en bronce, mármol, madera y materiales modernos
              </div>
              <div className="category-item">
                <strong>Fotografía:</strong> Arte fotográfico contemporáneo y experimental
              </div>
              <div className="category-item">
                <strong>Arte Digital:</strong> Creaciones digitales y arte generativo
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>Compromiso con el Arte</h2>
            <p>
              Más allá de ser una plataforma de compra y venta, ArtGallery está comprometida con 
              el desarrollo del ecosistema artístico. Organizamos exposiciones virtuales, talleres 
              para artistas emergentes y programas de mentoría que conectan artistas establecidos 
              con nuevos talentos.
            </p>
            <p>
              También trabajamos con instituciones educativas y organizaciones sin fines de lucro 
              para promover la educación artística y hacer que el arte sea más accesible para 
              comunidades desatendidas.
            </p>
          </div>

          <div className="about-section contact-cta">
            <h2>¿Quieres ser parte de nuestra comunidad?</h2>
            <p>
              Ya seas un artista buscando mostrar tu trabajo o un amante del arte buscando tu 
              próxima pieza favorita, te invitamos a explorar todo lo que ArtGallery tiene para ofrecer.
            </p>
            <div className="cta-buttons">
              <a href="/register" className="btn btn-primary">
                Únete como Artista
              </a>
              <a href="/catalogo" className="btn btn-outline">
                Explora el Catálogo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
