export const categories = [
  { id: 'abstract', name: 'Abstracto' },
  { id: 'realistic', name: 'Realista' },
  { id: 'impressionist', name: 'Impresionista' },
  { id: 'modern', name: 'Moderno' },
  { id: 'contemporary', name: 'Contemporáneo' },
  { id: 'classical', name: 'Clásico' },
]

// Productos iniciales
const initialProducts = [
  {
    id: 'natural-honey-bottle',
    name: 'Natural Honey Bottle',
    artist: 'Itar',
    category: 'abstract',
    price: 99000,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800&auto=format&fit=crop',
    description: 'Composición abstracta con elementos naturales y colores cálidos',
  },
  {
    id: 'itar-composition',
    name: 'Itar',
    artist: 'Itar',
    category: 'modern',
    price: 99000,
    stock: 3,
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=800&auto=format&fit=crop',
    description: 'Obra moderna con influencias contemporáneas',
  },
  {
    id: 'white-cap',
    name: 'White Cap',
    artist: 'Caps',
    category: 'contemporary',
    price: 99000,
    stock: 7,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800&auto=format&fit=crop',
    description: 'Composición minimalista en tonos blancos',
  },
  {
    id: 'jae-namaz',
    name: 'Jae Namaz',
    artist: 'Kafan',
    category: 'realistic',
    price: 99000,
    stock: 4,
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=800&auto=format&fit=crop',
    description: 'Pintura realista con detalles meticulosos',
  },
  {
    id: 'dates-composition',
    name: 'Dates',
    artist: 'Food',
    category: 'impressionist',
    price: 99000,
    stock: 6,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800&auto=format&fit=crop',
    description: 'Estilo impresionista con pinceladas sueltas',
  },
  {
    id: 'miswak-artwork',
    name: 'Miswak',
    artist: 'Food',
    category: 'classical',
    price: 99000,
    stock: 2,
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=800&auto=format&fit=crop',
    description: 'Obra clásica con técnicas tradicionales',
  },
]

// Función para cargar productos desde localStorage o usar los iniciales
export function loadProducts() {
  try {
    const saved = localStorage.getItem('artgallery_products')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (error) {
    console.error('Error al cargar productos:', error)
  }
  
  // Si no hay productos guardados, usar los iniciales y guardarlos
  saveProducts(initialProducts)
  return initialProducts
}

// Función para guardar productos en localStorage
export function saveProducts(productsArray) {
  try {
    localStorage.setItem('artgallery_products', JSON.stringify(productsArray))
  } catch (error) {
    console.error('Error al guardar productos:', error)
  }
}

// Función para actualizar el stock de un producto
export function updateProductStock(productId, newStock) {
  try {
    const products = loadProducts()
    const productIndex = products.findIndex(p => p.id === productId)
    if (productIndex !== -1) {
      products[productIndex].stock = Math.max(0, newStock) // No permitir stock negativo
      saveProducts(products)
      return true
    }
    return false
  } catch (error) {
    console.error('Error al actualizar stock:', error)
    return false
  }
}

// Cargar productos al importar el módulo
export const products = loadProducts()

