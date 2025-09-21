/**
 * COMPONENTE PRINCIPAL DE LA APLICACIÓN
 * 
 * Este es el componente raíz que configura toda la estructura de la aplicación.
 * Define el sistema de rutas, proveedores de contexto y la arquitectura general.
 * 
 * Características principales:
 * - Configuración de React Router para la navegación
 * - Jerarquía de contextos (User , Order, Product, Cart, Wishlist)
 * - Layout principal que envuelve todas las páginas
 * - Rutas protegidas y públicas
 */

import { Routes, Route, Navigate } from 'react-router-dom'
// Importación de proveedores de contexto global
import { UserProvider } from './context/UserContext'
import { ProductProvider } from './context/ProductContext'
import { OrderProvider } from './context/OrderContext' 
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'

// Importación del layout principal y páginas
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
// import CatalogPage from './pages/CatalogPage'  // Eliminado
import CategoriesPage from './pages/CategoriesPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import MyProductsPage from './pages/MyProductsPage'
import ArtistPage from './pages/ArtistPage' 
import ArtistProfilePage from './pages/ArtistProfilePage'
import MyAccountPage from './pages/MyAccountPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import RegisterPage from './pages/RegisterPage'
import FaqsPage from './pages/FaqsPage'
import AboutPage from './pages/AboutPage'
import './styles.css'

export default function App() {
  return (
    <UserProvider>
      <OrderProvider>
        <ProductProvider>
          <WishlistProvider>
            <CartProvider>
              <Layout>
                <Routes>
                  <Route path="/" element={<Navigate to="/home" replace />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/artistas" element={<ArtistPage />} />
                  <Route path="/artists/:artistId" element={<ArtistProfilePage />} />
                  <Route path="/home" element={<HomePage />} />
                  {/* Eliminada ruta /catalogo */}
                  <Route path="/categorias" element={<CategoriesPage />} />
                  <Route path="/producto/:id" element={<ProductPage />} />
                  <Route path="/carrito" element={<CartPage />} />
                  <Route path="/my-products" element={<MyProductsPage />} />
                  <Route path="/mi-cuenta" element={<MyAccountPage />} />
                  <Route path="/faqs" element={<FaqsPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
              </Layout>
            </CartProvider>
          </WishlistProvider>
        </ProductProvider>
      </OrderProvider>
    </UserProvider>
  )
}