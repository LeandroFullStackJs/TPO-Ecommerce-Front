/**
 * COMPONENTE FOOTER - PIE DE PÁGINA
 * 
 * Este componente renderiza el pie de página que aparece en todas las páginas
 * de la aplicación. Proporciona información adicional, enlaces de navegación
 * secundarios y datos de contacto de la galería de arte.
 * 
 * Características:
 * - Información sobre la empresa
 * - Enlaces rápidos a secciones principales
 * - Información de contacto
 * - Copyright dinámico con año actual
 * - Enlaces a páginas informativas (About, FAQ)
 * 
 * Estructura responsive organizada en secciones para fácil mantenimiento
 * y buena experiencia de usuario en todos los dispositivos.
 */

/**
 * COMPONENTE FOOTER
 * 
 * Pie de página estático que proporciona información adicional
 * y navegación secundaria para la aplicación.
 */
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* SECCIÓN PRINCIPAL - INFORMACIÓN DE LA MARCA */}
          <div className="footer-section">
            <h4>ArtGallery</h4>
            <p>Tu tienda de arte en línea</p>
          </div>
          
          {/* SECCIÓN DE ENLACES RÁPIDOS */}
          <div className="footer-section">
            <h4>Enlaces Rápidos</h4>
            <ul>
              <li><a href="/catalogo">Catálogo</a></li>
              <li><a href="/artistas">Artistas</a></li>
              <li><a href="/carrito">Carrito</a></li>
              <li><a href="/login">Iniciar sesión</a></li>
            </ul>
          </div>
          
          {/* SECCIÓN DE INFORMACIÓN INSTITUCIONAL */}
          <div className="footer-section">
            <h4>Información</h4>
            <ul>
              <li><a href="/about">Sobre Nosotros</a></li>
              <li><a href="/faqs">Preguntas Frecuentes</a></li>
              <li><a href="/register">Únete como Artista</a></li>
            </ul>
          </div>
          
          {/* SECCIÓN DE DATOS DE CONTACTO */}
          <div className="footer-section">
            <h4>Contacto</h4>
            <p>info@artgallery.com</p>
            <p>+54 11 1234-5678</p>
          </div>
        </div>
        
        {/* LÍNEA INFERIOR CON COPYRIGHT */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ArtGallery. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}