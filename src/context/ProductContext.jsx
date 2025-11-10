/**
 * CONTEXTO DE GESTIÓN DE PRODUCTOS
 * 
 * Este contexto centraliza todo el estado y las operaciones relacionadas
 * con productos/obras de arte en la aplicación. Proporciona una interfaz
 * unificada para que todos los componentes accedan y modifiquen productos.
 * 
 * Responsabilidades principales:
 * - Mantener la lista de productos en memoria
 * - Sincronizar con la API cuando se realizan cambios
 * - Proporcionar métodos CRUD para productos
 * - Gestionar estados de carga y error
 * - Actualizar automáticamente la UI cuando cambian los datos
 * 
 * Utiliza el patrón Provider/Consumer de React Context API
 * para compartir estado entre componentes sin prop drilling.
 * 
 * Beneficios: Estado centralizado, fácil sincronización, menos re-renders
 */

import { createContext, useContext, useState, useEffect } from 'react'
import { productsAPI } from '../api/products'

/**
 * CONTEXTO DE PRODUCTOS
 * 
 * Crea el contexto que compartirá el estado de productos
 * entre todos los componentes de la aplicación.
 */
const ProductContext = createContext(null)

/**
 * PROVEEDOR DE CONTEXTO DE PRODUCTOS
 * 
 * Componente que envuelve la aplicación y proporciona el estado
 * y métodos de productos a todos los componentes hijos.
 * 
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 */
export function ProductProvider({ children }) {
  // Estados principales del contexto
  const [products, setProducts] = useState([])     // Lista de productos
  const [loading, setLoading] = useState(true)     // Estado de carga
  const [error, setError] = useState(null)         // Estado de error

  /**
   * EFECTO DE INICIALIZACIÓN - CARGA AUTOMÁTICA DE PRODUCTOS
   * 
   * Este useEffect se ejecuta UNA SOLA VEZ cuando el ProductProvider se monta.
   * Es crucial para tener los productos disponibles desde el inicio de la app.
   * 
   * ¿Por qué es importante?
   * - Los productos se cargan automáticamente al abrir la aplicación
   * - Evita que las páginas muestren "sin productos" inicialmente
   * - Centraliza la carga inicial en un solo lugar
   * - Garantiza que el estado esté listo para todos los componentes
   */
  useEffect(() => {
    loadProducts()  // Ejecutar carga inicial de productos
  }, [])            // Array vacío: solo ejecutar al montar

  /**
   * CARGAR PRODUCTOS DESDE LA API - FUNCIÓN CENTRALIZADA
   * 
   * Función que maneja todo el flujo de carga de productos:
   * 1. Activa estado de carga (UI muestra spinner)
   * 2. Limpia errores previos
   * 3. Llama a la API
   * 4. Actualiza estado con productos recibidos
   * 5. Maneja errores si fallan las llamadas
   * 6. Siempre desactiva estado de carga
   * 
   * Patrón async/await con try/catch/finally para manejo robusto
   */
  const loadProducts = async () => {
    try {
      // PASO 1: Activar indicador de carga para UI
      setLoading(true)
      
      // PASO 2: Limpiar errores de intentos anteriores
      setError(null)
      
      // PASO 3: LLAMADA A LA API - Obtener todos los productos
      // productsAPI.getAll() hace GET request a /products
      const data = await productsAPI.getAll()
      
      console.log('📦 Productos cargados:', data.length, 'productos')
      console.log('📦 Ejemplo de producto:', data[0])
      
      // PASO 4: ÉXITO - Actualizar estado con productos recibidos
      setProducts(data)  // Esto triggerea re-render en componentes que usan productos
      
    } catch (err) {
      // PASO 5: ERROR - Manejar fallas de red, servidor, etc.
      console.error('Error al cargar productos:', err)
      
      // Establecer mensaje de error para mostrar en UI
      setError('Error al cargar productos')
      
      // Nota: products se mantiene con valor anterior (o vacío si es primera carga)
      
    } finally {
      // PASO 6: SIEMPRE ejecutar - Desactivar indicador de carga
      setLoading(false)  // UI deja de mostrar spinner
    }
  }

  /**
   * ACTUALIZAR STOCK DE PRODUCTO
   * 
   * Actualiza el stock de un producto específico tanto en la API
   * como en el estado local del contexto.
   * 
   * @param {number} productId - ID del producto a actualizar
   * @param {number} newStock - Nuevo valor de stock
   * @returns {Promise<Object>} Producto actualizado
   */
  const updateProductStock = async (productId, newStock) => {
    try {
      // Actualizar en la API
      const updatedProduct = await productsAPI.updateStock(productId, newStock)
      
      // Actualizar en el estado local
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

  /**
   * DECREMENTAR STOCK (USADO EN COMPRAS)
   * 
   * Reduce el stock de un producto en una cantidad específica.
   * Utilizado durante el proceso de checkout para reflejar ventas.
   * 
   * @param {number} productId - ID del producto
   * @param {number} quantity - Cantidad a descontar
   * @returns {Promise<Object>} Producto con stock actualizado
   */
  const decrementProductStock = async (productId, quantity) => {
    try {
      // Decrementar stock en la API (incluye validación de stock mínimo)
      const updatedProduct = await productsAPI.decrementStock(productId, quantity)
      
      // Sincronizar estado local
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

  /**
   * CREAR NUEVO PRODUCTO
   * 
   * Añade un nuevo producto al catálogo tanto en la API
   * como en el estado local.
   * 
   * @param {Object} productData - Datos del nuevo producto
   * @returns {Promise<Object>} Producto creado con ID asignado
   */
  const createProduct = async (productData) => {
    try {
      // Crear en la API
      const newProduct = await productsAPI.create(productData)
      
      // Añadir al estado local
      setProducts(prevProducts => [...prevProducts, newProduct])
      
      return newProduct
    } catch (err) {
      console.error('Error al crear producto:', err)
      throw err
    }
  }

  /**
   * ACTUALIZAR PRODUCTO EXISTENTE
   * 
   * Modifica un producto completo tanto en la API como en el estado local.
   * 
   * @param {number} id - ID del producto a actualizar
   * @param {Object} productData - Nuevos datos del producto
   * @returns {Promise<Object>} Producto actualizado
   */
  const updateProduct = async (id, productData) => {
    try {
      // Actualizar en la API
      const updatedProduct = await productsAPI.update(id, productData)
      
      // Sincronizar estado local
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

  /**
   * ELIMINAR PRODUCTO
   * 
   * Elimina un producto del catálogo tanto en la API como en el estado local.
   * 
   * @param {number} id - ID del producto a eliminar
   */
  const deleteProduct = async (id) => {
    try {
      // Eliminar de la API
      await productsAPI.delete(id)
      
      // Eliminar del estado local
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id))
    } catch (err) {
      console.error('Error al eliminar producto:', err)
      throw err
    }
  }

  /**
   * RECARGAR PRODUCTOS
   * 
   * Vuelve a cargar todos los productos desde la API.
   * Útil para sincronizar después de cambios externos.
   */
  const refreshProducts = () => {
    loadProducts()
  }

  /**
   * VALOR DEL CONTEXTO
   * 
   * Objeto que contiene todo el estado y métodos que estarán
   * disponibles para los componentes que consuman este contexto.
   */
  const value = {
    products,                    // Lista de productos
    loading,                     // Estado de carga
    error,                       // Estado de error
    updateProductStock,          // Actualizar stock
    decrementProductStock,       // Decrementar stock
    createProduct,               // Crear producto
    updateProduct,               // Actualizar producto
    deleteProduct,               // Eliminar producto
    refreshProducts              // Recargar productos
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}

/**
 * HOOK PERSONALIZADO PARA USAR EL CONTEXTO
 * 
 * Hook que simplifica el uso del ProductContext y añade validación
 * para asegurar que se use dentro del Provider correspondiente.
 * 
 * @returns {Object} Estado y métodos del contexto de productos
 * @throws {Error} Si se usa fuera del ProductProvider
 * 
 * @example
 * const { products, createProduct, loading } = useProducts()
 */
export function useProducts() {
  const ctx = useContext(ProductContext)
  if (!ctx) {
    throw new Error('useProducts debe usarse dentro de ProductProvider')
  }
  return ctx
}
