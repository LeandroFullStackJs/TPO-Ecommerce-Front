export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>ArtGallery</h4>
            <p>Tu tienda de arte en línea</p>
          </div>
          
          <div className="footer-section">
            <h4>Enlaces Rápidos</h4> {/* Título adaptado */}
            <ul>
              <li><a href="/catalogo">Catálogo</a></li>
              <li><a href="/artistas">Artistas</a></li>
              <li><a href="/carrito">Carrito</a></li>
              <li><a href="/login">Iniciar sesión</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Información</h4>
            <ul>
              <li><a href="/about">Sobre Nosotros</a></li>
              <li><a href="/faqs">Preguntas Frecuentes</a></li>
              <li><a href="/register">Únete como Artista</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contacto</h4>
            <p>info@artgallery.com</p>
            <p>+54 11 1234-5678</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ArtGallery. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}