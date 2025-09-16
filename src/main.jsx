/**
 * PUNTO DE ENTRADA PRINCIPAL DE LA APLICACIÓN REACT
 * 
 * Este archivo inicializa la aplicación React y la monta en el DOM.
 * Configura React Router para el manejo de rutas del lado del cliente.
 * 
 * Funcionalidades:
 * - Renderizado de la aplicación en modo estricto para detectar problemas
 * - Configuración del router para navegación SPA (Single Page Application)
 * - Montaje en el elemento DOM con id 'root'
 * 
 * Nota: Los contextos globales están configurados en App.jsx para mayor
 * claridad y mejor organización de la arquitectura de la aplicación.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'

// Obtener el elemento root del DOM donde se montará la aplicación
const container = document.getElementById('root')
if (container) {
  const root = ReactDOM.createRoot(container)
  root.render(
    <React.StrictMode>
      {/* BrowserRouter habilita el enrutamiento del lado del cliente */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  )
}