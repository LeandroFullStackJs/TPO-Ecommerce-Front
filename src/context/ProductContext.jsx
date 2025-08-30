import { createContext, useContext, useState, useEffect } from 'react'
import { productsAPI } from '../api/products'

const ProductContext = createContext(null)

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar productos desde la API
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productsAPI.getAll()
      setProducts(data)
    } catch (err) {
      console.error('Error al cargar productos:', err)
      setError('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  // Función para actualizar el stock de un producto
  const updateProductStock = async (productId, newStock) => {
    try {
      const updatedProduct = await productsAPI.updateStock(productId, newStock)
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === productId ? updatedProduct : product
        )
      )
      return updatedProduct
    } catch (err) {
      console.error('Error al actualizar stock:', err)
      throw err
    }
  }

  // Función para descontar stock (usada en checkout)
  const decrementProductStock = async (productId, quantity) => {
    try {
      const updatedProduct = await productsAPI.decrementStock(productId, quantity)
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === productId ? updatedProduct : product
        )
      )
      return updatedProduct
    } catch (err) {
      console.error('Error al descontar stock:', err)
      throw err
    }
  }

  // Función para crear nuevo producto
  const createProduct = async (productData) => {
    try {
      const newProduct = await productsAPI.create(productData)
      setProducts(prevProducts => [...prevProducts, newProduct])
      return newProduct
    } catch (err) {
      console.error('Error al crear producto:', err)
      throw err
    }
  }

  // Función para actualizar producto
  const updateProduct = async (id, productData) => {
    try {
      const updatedProduct = await productsAPI.update(id, productData)
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === id ? updatedProduct : product
        )
      )
      return updatedProduct
    } catch (err) {
      console.error('Error al actualizar producto:', err)
      throw err
    }
  }

  // Función para eliminar producto
  const deleteProduct = async (id) => {
    try {
      await productsAPI.delete(id)
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id))
    } catch (err) {
      console.error('Error al eliminar producto:', err)
      throw err
    }
  }

  // Función para recargar productos
  const refreshProducts = () => {
    loadProducts()
  }

  const value = {
    products,
    loading,
    error,
    updateProductStock,
    decrementProductStock,
    createProduct,
    updateProduct,
    deleteProduct,
    refreshProducts
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  const ctx = useContext(ProductContext)
  if (!ctx) throw new Error('useProducts debe usarse dentro de ProductProvider')
  return ctx
}
