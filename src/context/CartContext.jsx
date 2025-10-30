/**
 * CONTEXTO DEL CARRITO DE COMPRAS - GESTIÓN COMPLETA DEL CARRITO
 * 
 * Este contexto maneja todo lo relacionado con el carrito de compras:
 * - Agregado y eliminación de productos
 * - Cálculo de totales y cantidades
 * - Persistencia en localStorage
 * - Validación de stock disponible
 * - Integración con contextos de usuario, productos y órdenes
 * 
 * Utiliza useReducer para manejar estados complejos de manera predecible
 * y optimizada, siguiendo el patrón Redux.
 */

import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
// Dependencias de otros contextos para funcionalidad completa
import { useProducts } from './ProductContext' 
import { useUser } from '../context/UserContext'
import { useOrders } from '../context/OrderContext'

// Crear el contexto del carrito
const CartContext = createContext(null)

/**
 * REDUCER DEL CARRITO - MANEJO CENTRALIZADO DEL ESTADO
 * 
 * Utiliza el patrón Reducer para manejar estados complejos de manera predecible.
 * Cada acción produce un nuevo estado inmutable, facilitando el debugging
 * y manteniendo la consistencia de datos.
 * 
 * @param {Object} state - Estado actual del carrito
 * @param {Object} action - Acción a ejecutar con su tipo y payload
 * @returns {Object} Nuevo estado del carrito
 */
function cartReducer(state, action) {
  switch (action.type) {
    // Acción: AGREGAR PRODUCTO AL CARRITO
    case 'ADD': {
      const { product, quantity } = action
      const existing = state.items.find(i => i.id === product.id)
      let newItems
      
      if (existing) {
        // Si el producto ya existe, incrementar su cantidad
        newItems = state.items.map(i => 
          i.id === product.id 
            ? { ...i, quantity: i.quantity + quantity } 
            : i
        )
      } else {
        // Si es nuevo, agregarlo al carrito
        newItems = [...state.items, { ...product, quantity }]
      }
      
      // Retornar nuevo estado inmutable
      return { ...state, items: newItems }
    }
    
    // Acción: ELIMINAR PRODUCTO DEL CARRITO
    case 'REMOVE': {
      // Filtrar para eliminar el producto especificado
      return { 
        ...state, 
        items: state.items.filter(i => i.id !== action.id) 
      }
    }
    
    // Acción: ESTABLECER CANTIDAD ESPECÍFICA
    case 'SET_QTY': {
      const { id, quantity } = action
      // Actualizar la cantidad de un producto específico en el carrito
      return { 
        ...state, 
        items: state.items.map(i => 
          i.id === id ? { ...i, quantity } : i
        ) 
      }
    }
    
    // Acción: LIMPIAR TODO EL CARRITO
    case 'CLEAR': {
      // Vaciar completamente el carrito
      return { ...state, items: [] }
    }
    
    // Acción: CHECKOUT COMPLETADO
    case 'CHECKOUT': {
      // Limpiar carrito después de una compra exitosa
      return { ...state, items: [] }
    }
    
    // Acción por defecto: no modificar el estado
    default:
      return state
  }
}

/**
 * PROVEEDOR DEL CONTEXTO DEL CARRITO
 * 
 * Componente que proporciona la funcionalidad completa del carrito
 * a toda la aplicación. Maneja la persistencia, validaciones y
 * la integración con otros contextos.
 */
export function CartProvider({ children }) {
  /**
   * INICIALIZACIÓN DEL ESTADO CON REDUCER
   * 
   * useReducer es preferible a useState para estados complejos
   * porque centraliza la lógica de actualización y hace el código
   * más predecible y fácil de debuggear.
   */
  const [state, dispatch] = useReducer(cartReducer, { items: [] })
  
  // Acceso a contextos dependientes para funcionalidad completa
  const { products, decrementProductStock } = useProducts()
  const { user, isAuthenticated } = useUser() // Añadido isAuthenticated
  const { addOrder } = useOrders()
  // Teoría: useEffect para Persistencia de Datos (LocalStorage)
  // Este efecto se ejecuta una vez al montar el componente para cargar el carrito desde localStorage.
  useEffect(() => {
    try {
      const saved = localStorage.getItem('techparts_cart')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && Array.isArray(parsed.items)) {
          // Funcionamiento: Carga los items guardados en el carrito.
          // Se usa un ADD con quantity 0 y luego SET_QTY para asegurar que las cantidades exactas se establezcan correctamente.
          parsed.items.forEach(i => dispatch({ type: 'ADD', product: i, quantity: 0 }))
          parsed.items.forEach(i => dispatch({ type: 'SET_QTY', id: i.id, quantity: i.quantity }))
        }
      }
    } catch (e) {
      console.error("Error loading cart from localStorage:", e);
      // Opcional: Limpiar localStorage si hay un error de parseo
      localStorage.removeItem('techparts_cart');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // El array vacío asegura que se ejecute solo una vez al montar.

  // Teoría: useEffect para Persistencia de Datos (LocalStorage)
  // Este efecto se ejecuta cada vez que 'state.items' cambia para guardar el carrito en localStorage.
  useEffect(() => {
    try {
      localStorage.setItem('techparts_cart', JSON.stringify({ items: state.items }))
    } catch (e) {
      console.error("Error saving cart to localStorage:", e);
    }
  }, [state.items]) // Se ejecuta cuando 'state.items' cambia.

  // Teoría: useMemo para Optimización de Cálculos
  // 'useMemo' memoriza el resultado de una función y solo la recalcula si sus dependencias cambian.
  // Esto evita recálculos innecesarios de los totales del carrito en cada renderizado.
  const totals = useMemo(() => {
    const subtotal = state.items.reduce((acc, i) => acc + i.price * i.quantity, 0)
    const iva = subtotal * 0.21
    const total = subtotal + iva
    const count = state.items.reduce((acc, i) => acc + i.quantity, 0)
    return { subtotal, iva, total, count }
  }, [state.items]) // Se recalcula solo cuando 'state.items' cambia.

  // Funcionamiento: Validación de stock al agregar al carrito
  // Verifica si la cantidad deseada de un producto, sumada a la cantidad ya en el carrito,
  // no excede el stock disponible del producto.
  const canAddToCart = (product, quantity = 1) => {
    const existingItem = state.items.find(i => i.id === product.id)
    const currentQuantity = existingItem ? existingItem.quantity : 0
    const totalQuantity = currentQuantity + quantity
    return totalQuantity <= product.stock
  }

  // Funcionamiento: Validación de stock antes de finalizar la compra
  // Recorre todos los items en el carrito y verifica que la cantidad de cada uno
  // no exceda el stock actual del producto (obtenido del ProductContext).
  const canCheckout = () => {
    // Primero, verifica si hay items en el carrito
    if (state.items.length === 0) {
      return false; // No se puede hacer checkout si el carrito está vacío
    }
    // Luego, verifica si el usuario está autenticado
    if (!isAuthenticated) {
      return false; // No se puede hacer checkout si el usuario no está logueado
    }
    // Finalmente, verifica el stock de cada producto
    return state.items.every(item => {
      const product = products.find(p => p.id === item.id)
      return product && item.quantity <= product.stock
    })
  }

  // Funcionamiento: Proceso de checkout
  // Esta función es asíncrona porque interactúa con la API para descontar stock.
  const checkout = async () => {
    if (!isAuthenticated || !user?.id) { // Asegurarse de que el usuario esté autenticado antes de proceder
      throw new Error('Debes iniciar sesión para finalizar la compra.')
    }
    if (!canCheckout()) {
      throw new Error('No hay stock suficiente para algunos productos o el carrito está vacío.') // Mensaje más descriptivo
    }
    
    try {
      // Funcionamiento: Descuento de stock
      // Crea un array de promesas, donde cada promesa es una llamada a 'decrementProductStock'
      // para cada item en el carrito.
      const promises = state.items.map(item => 
        decrementProductStock(item.id, item.quantity)
      )
      // Teoría: Promise.all
      // Espera a que todas las promesas de descuento de stock se resuelvan exitosamente.
      await Promise.all(promises)
      const orderData = {
        usuarioId: user.id,
        fecha: new Date().toISOString(),
        items: state.items.map(item => ({
          productoId: item.id,
          cantidad: item.quantity,
          precioUnitario: item.price,
          subtotal: item.price * item.quantity,
          // Datos adicionales para el frontend
          nombreObra: item.name,
          imagen: item.image,
          artista: item.artist
        })),
        total: totals.total,
        estado: 'PENDIENTE'
      }
      await addOrder(orderData)
      // Funcionamiento: Limpiar carrito después de un checkout exitoso.
      dispatch({ type: 'CHECKOUT' })
    } catch (error) {
      console.error('Error en checkout:', error)
      // Bug fix: Si el error es de la API (ej. stock ya no disponible), relanzar con un mensaje más amigable.
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al procesar la compra. Inténtalo de nuevo. Asegúrate de tener stock suficiente y estar logueado.'); // Relanza el error para que el componente UI lo maneje.
    }
  }

  // Teoría: useMemo para el Objeto de Valor del Contexto
  // Memoriza el objeto 'value' que se pasa al Provider.
  // Esto evita que los componentes consumidores se re-rendericen innecesariamente
  // si el objeto 'value' cambia de referencia pero no de contenido relevante.
  const value = useMemo(() => ({
    items: state.items, // Items actuales en el carrito.
    addToCart: (product, quantity = 1) => {
      // Funcionamiento: Lógica para agregar al carrito con validación de stock.
      // Eliminada la validación de usuario aquí para permitir añadir al carrito sin login.
      if (canAddToCart(product, quantity)) {
        dispatch({ type: 'ADD', product, quantity })
      } else {
        throw new Error('No hay stock suficiente para este producto') // Lanza error si no hay stock.
      }
    },
    removeFromCart: (id) => dispatch({ type: 'REMOVE', id }), // Elimina un item por ID.
    setQuantity: (id, quantity) => {
      // Funcionamiento: Lógica para cambiar la cantidad de un item con validación de stock.
      const item = state.items.find(i => i.id === id)
      if (item) {
        const product = products.find(p => p.id === id)
        if (product && quantity <= product.stock) {
          dispatch({ type: 'SET_QTY', id, quantity })
        } else {
          throw new Error('No hay stock suficiente para esta cantidad') // Lanza error si la nueva cantidad excede el stock.
        }
      }
    },
    clearCart: () => dispatch({ type: 'CLEAR' }), // Vacía el carrito.
    canAddToCart, // Función de validación para agregar.
    canCheckout, // Función de validación para checkout.
    checkout, // Función para finalizar la compra.
    totals, // Objeto con los totales calculados.
  }), [state.items, totals, products, decrementProductStock, isAuthenticated, user]) // Dependencias del useMemo.

  return (
    // Funcionamiento: El Provider envuelve a los componentes hijos y les proporciona el 'value'.
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// Teoría: Custom Hook (useCart)
// Un custom hook que simplifica el consumo del CartContext.
// Permite a cualquier componente funcional acceder al estado y funciones del carrito
// sin necesidad de importar 'useContext' y 'CartContext' directamente.
export function useCart() {
  const ctx = useContext(CartContext)
  // Funcionamiento: Asegura que el hook se use dentro de un CartProvider.
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}