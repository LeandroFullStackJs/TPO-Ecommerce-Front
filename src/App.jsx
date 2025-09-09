import { Routes, Route, Navigate } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import { ProductProvider } from './context/ProductContext'
import { CartProvider } from './context/CartContext'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CatalogPage from './pages/CatalogPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import MyProductsPage from './pages/MyProductsPage'
import ArtistPage from './pages/artistPage'
import ArtistProfilePage from './pages/ArtistProfilePage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'


export default function App() {
  return (
    <UserProvider>
      <ProductProvider>
        <CartProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/artistas" element={<ArtistPage />} />
              <Route path="/artists/:artistId" element={<ArtistProfilePage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} /> 
              <Route path="/home" element={<HomePage />} />
              <Route path="/catalogo" element={<CatalogPage />} />
              <Route path="/producto/:id" element={<ProductPage />} />
              <Route path="/carrito" element={<CartPage />} />
              <Route path="/my-products" element={<MyProductsPage />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </Layout>
        </CartProvider>
      </ProductProvider>
    </UserProvider>
  )
}

