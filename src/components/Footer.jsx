export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>TechParts</h4>
            <p>Tu tienda de componentes de computación</p>
          </div>
          
          <div className="footer-section">
            <h4>Enlaces</h4>
            <ul>
              <li><a href="/home">Productos</a></li>
              <li><a href="/cart">Carrito</a></li>
              <li><a href="/login">Iniciar sesión</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contacto</h4>
            <p>info@techparts.com</p>
            <p>+54 11 1234-5678</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} TechParts. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
