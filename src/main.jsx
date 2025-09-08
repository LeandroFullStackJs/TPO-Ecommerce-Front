import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import { OrderProvider } from './context/OrderContext'
import { ProductProvider } from './context/ProductContext'
import { CartProvider } from './context/CartContext'

const container = document.getElementById('root')
if (container) {
  const root = ReactDOM.createRoot(container)
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <UserProvider>
          <OrderProvider> {}
            <ProductProvider>
              <CartProvider> {}
                <App />
              </CartProvider>
            </ProductProvider>
          </OrderProvider>
        </UserProvider>
      </BrowserRouter>
    </React.StrictMode>
  )
}