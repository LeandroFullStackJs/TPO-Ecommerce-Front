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
 * - Sistema de notificaciones para mensajes del sistema
 * - Diseño responsivo que se adapta a diferentes dispositivos
 * 
 * Patrón de diseño: Layout Component Pattern
 * Permite reutilizar la estructura común sin duplicar código.
 */

import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }) {
  const location = useLocation()
  const [notification, setNotification] = useState(null)

  /**
   * MANEJO DE NOTIFICACIONES DESDE EL ROUTER STATE
   * 
   * Escucha cambios en la ubicación y muestra mensajes que vienen
   * del state de React Router (ej: desde rutas protegidas)
   */
  useEffect(() => {
    if (location.state?.message) {
      setNotification({
        message: location.state.message,
        type: location.state.type || 'info'
      })
      
      // Auto-ocultar después de 5 segundos
      const timer = setTimeout(() => {
        setNotification(null)
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [location.state])

  return (
    <div className="layout">
      {/* Barra de navegación superior con menús y carrito */}
      <Navbar />
      
      {/* Sistema de notificaciones */}
      {notification && (
        <div 
          className={`notification ${notification.type}`}
          style={{
            position: 'fixed',
            top: '80px', // Debajo del navbar
            right: '20px',
            zIndex: 1000,
            backgroundColor: notification.type === 'error' ? '#ffebee' : '#e3f2fd',
            border: `1px solid ${notification.type === 'error' ? '#ef5350' : '#90caf9'}`,
            borderRadius: '8px',
            padding: '16px 20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            maxWidth: '400px',
            color: notification.type === 'error' ? '#c62828' : '#1976d2'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                marginLeft: '10px',
                color: 'inherit'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* Contenido principal que cambia según la ruta actual */}
      <main className="main-content">
        {children}
      </main>
      
      {/* Pie de página con información y enlaces adicionales */}
      <Footer />
    </div>
  )
}

