export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>ArtGallery</h4> {/* Cambiado de TechParts */}
            <p>Tu espacio para descubrir y adquirir obras de arte únicas.</p> {/* Mensaje adaptado */}
          </div>
          
          <div className="footer-section">
            <h4>Enlaces Rápidos</h4> {/* Título adaptado */}
            <ul>
              <li><a href="/catalogo">Explorar Obras</a></li> {/* Enlace adaptado */}
              <li><a href="/carrito">Mi Carrito</a></li> {/* Enlace adaptado */}
              <li><a href="/mi-cuenta">Mi Cuenta</a></li> {/* Nuevo enlace útil */}
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contacto</h4>
            <p>info@artgallery.com</p> {/* Email adaptado */}
            <p>+54 11 9876-5432</p> {/* Teléfono adaptado */}
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ArtGallery. Todos los derechos reservados.</p> {/* Copyright adaptado */}
        </div>
      </div>
    </footer>
  )
}