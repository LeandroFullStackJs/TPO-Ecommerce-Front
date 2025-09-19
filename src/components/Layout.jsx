/**
 * COMPONENTE LAYOUT - ESTRUCTURA PRINCIPAL DE LA APLICACIÓN
 * 
 * Este componente define la estructura básica que se aplica a todas las páginas.
 * Proporciona consistencia visual y de navegación en toda la aplicación.
 * 
 * Características:
 * - Navbar fija en la parte superior
 * - Área de contenido principal que cambia según la ruta
 * - Footer fijo en la parte inferior
 * - Diseño responsivo que se adapta a diferentes dispositivos
 * 
 * Patrón de diseño: Layout Component Pattern
 * Permite reutilizar la estructura común sin duplicar código.
 */

import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }) {
  return (
    <div className="layout">
      {/* Barra de navegación superior con menús y carrito */}
      <Navbar />
      
      {/* Contenido principal que cambia según la ruta actual */}
      <main className="main-content">
        {children}
      </main>
      
      {/* Pie de página con información y enlaces adicionales */}
      <Footer />
    </div>
  )
}

