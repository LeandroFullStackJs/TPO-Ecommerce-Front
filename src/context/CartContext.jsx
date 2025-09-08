import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { useProducts } from './ProductContext' // Teoría: Dependencia de otro contexto para acceder a la información de productos y funciones de stock.
import { useUser } from '../context/UserContext'
import { useOrders } from '../context/OrderContext'

// Teoría: Context API
// createContext crea un objeto Context. Los componentes pueden suscribirse a él para leer cambios en el contexto.
const CartContext = createContext(null)

// Teoría: Reducer (useReducer)
// Una función reducer es una alternativa a useState para manejar estados más complejos.
// Recibe el estado actual y una acción, y devuelve un nuevo estado.
// Esto centraliza la lógica de actualización del estado del carrito.
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { product, quantity } = action
      const existing = state.items.find(i => i.id === product.id)
      let newItems
      // Funcionamiento: Si el producto ya está en el carrito, incrementa su cantidad.
      // Si no, lo añade como un nuevo item.
      if (existing) {
        newItems = state.items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i)
      } else {
        newItems = [...state.items, { ...product, quantity }]
      }
      return { ...state, items: newItems } // Devuelve un nuevo estado inmutable.
    }
    case 'REMOVE': {
      // Funcionamiento: Filtra el array de items para eliminar el producto con el 'id' especificado.
      return { ...state, items: state.items.filter(i => i.id !== action.id) }
    }
    case 'SET_QTY': {
      const { id, quantity } = action
      // Funcionamiento: Mapea el array de items para actualizar la cantidad de un producto específico.
      return { ...state, items: state.items.map(i => i.id === id ? { ...i, quantity } : i) }
    }
    case 'CLEAR': {
      // Funcionamiento: Vacía el array de items del carrito.
      return { ...state, items: [] }
    }
    case 'CHECKOUT': {
      // Funcionamiento: También vacía el carrito después de un checkout exitoso.
      return { ...state, items: [] }
    }
    default:
      return state // En caso de acción desconocida, devuelve el estado sin cambios.
  }
}

// Teoría: Provider (CartProvider)
// El componente Provider es el que envuelve a los componentes que necesitan acceder al contexto.
// Recibe 'children' y proporciona el 'value' del contexto a todos sus descendientes.
export function CartProvider({ children }) {
  // Teoría: useReducer Hook
  // Inicializa el estado del carrito y la función 'dispatch' para enviar acciones al reducer.
  const [state, dispatch] = useReducer(cartReducer, { items: [] })
  // Teoría: Consumo de otro Contexto
  // Accede a 'products' y 'decrementProductStock' del ProductContext.
  // Esto permite que el CartContext interactúe con el stock de productos.
  const { products, decrementProductStock } = useProducts()
  const { user } = useUser ()
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
    return state.items.every(item => {
      const product = products.find(p => p.id === item.id)
      return product && item.quantity <= product.stock
    })
  }

  // Funcionamiento: Proceso de checkout
  // Esta función es asíncrona porque interactúa con la API para descontar stock.
  const checkout = async () => {
    if (!canCheckout()) {
      throw new Error('No hay stock suficiente para algunos productos') // Lanza un error si la validación falla.
    }
    if (!user || !user.id) {
      throw new Error('Debes iniciar sesión para finalizar la compra.')
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
        userId: user.id,
        date: new Date().toISOString(),
        items: state.items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          artist: item.artist,
          dimensions: item.dimensions,
          year: item.year,
          technique: item.technique
        })),
        total: totals.total,
          status: 'completed'
      }
      await addOrder(orderData)
      // Funcionamiento: Limpiar carrito después de un checkout exitoso.
      dispatch({ type: 'CHECKOUT' })
    } catch (error) {
      console.error('Error en checkout:', error)
      throw new Error('Error al procesar la compra. Inténtalo de nuevo.') // Relanza el error para que el componente UI lo maneje.
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
  }), [state.items, totals, products, decrementProductStock]) // Dependencias del useMemo.

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