export const categories = [
  { id: 'cpu', name: 'Procesadores' },
  { id: 'gpu', name: 'Placas de video' },
  { id: 'ram', name: 'Memorias RAM' },
  { id: 'storage', name: 'Almacenamiento' },
  { id: 'mb', name: 'Motherboards' },
  { id: 'psu', name: 'Fuentes' },
]

// Productos iniciales
const initialProducts = [
  {
    id: 'cpu-ryzen5-5600',
    name: 'AMD Ryzen 5 5600',
    brand: 'AMD',
    category: 'cpu',
    price: 189999,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1591486063071-ffa1904be7e1?q=80&w=800&auto=format&fit=crop',
    description: 'Procesador 6C/12T, base 3.5GHz boost 4.4GHz, AM4',
  },
  {
    id: 'gpu-rtx4060',
    name: 'NVIDIA GeForce RTX 4060 8GB',
    brand: 'NVIDIA',
    category: 'gpu',
    price: 699999,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1616401784845-180882ba9baa?q=80&w=800&auto=format&fit=crop',
    description: 'Ada Lovelace, DLSS 3, perfecto para 1080p/1440p',
  },
  {
    id: 'ram-16gb-3200',
    name: 'DDR4 16GB 3200MHz (2x8GB)',
    brand: 'Corsair',
    category: 'ram',
    price: 99999,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1587202372775-98927b2755da?q=80&w=800&auto=format&fit=crop',
    description: 'Kit dual-channel, latencia CL16',
  },
  {
    id: 'ssd-1tb',
    name: 'SSD NVMe 1TB Gen4',
    brand: 'WD',
    category: 'storage',
    price: 149999,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?q=80&w=800&auto=format&fit=crop',
    description: 'Lectura 7000MB/s - Escritura 5300MB/s',
  },
  {
    id: 'mb-b550',
    name: 'Motherboard B550 ATX',
    brand: 'MSI',
    category: 'mb',
    price: 229999,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=800&auto=format&fit=crop',
    description: 'AM4, PCIe 4.0, VRM reforzado',
  },
  {
    id: 'psu-650w',
    name: 'Fuente 650W 80+ Gold',
    brand: 'EVGA',
    category: 'psu',
    price: 129999,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1622799034854-35a504a0f2d1?q=80&w=800&auto=format&fit=crop',
    description: 'Modular, silenciosa, protección OCP/OVP/OTP',
  },
]

// Función para cargar productos desde localStorage o usar los iniciales
export function loadProducts() {
  try {
    const saved = localStorage.getItem('techparts_products')
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
    localStorage.setItem('techparts_products', JSON.stringify(productsArray))
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

