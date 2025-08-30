# ArtGallery - Galería de Arte Online

## 🎨 **Descripción**
ArtGallery es una aplicación web de e-commerce especializada en la venta de obras de arte originales. Desarrollada en React con una API completa usando JSON-Server, ofrece una experiencia elegante para coleccionistas y amantes del arte que buscan adquirir obras únicas.

## ✨ **Funcionalidades Implementadas**

### 🔐 **Sistema de Autenticación**
- **Login/Registro**: Formularios con validaciones completas
- **Gestión de sesiones**: Persistencia en localStorage
- **Roles de usuario**: Admin y usuario regular
- **Protección de rutas**: Acceso condicional según autenticación

### �️ **Catálogo de Arte**
- **Galería completa**: Obras de arte organizadas por categorías
- **Filtros avanzados**: Por estilo artístico y búsqueda
- **Categorías artísticas**: Abstracto, Paisajes, Retratos, Naturaleza, Minimalista, Geométrico, Contemporáneo, Texturizado
- **Detalle de obra**: Vista completa con información del artista, dimensiones, técnica y año
- **Imágenes optimizadas**: Sistema de respaldo automático para garantizar carga correcta

### 🏛️ **Información Artística Detallada**
- **Datos del artista**: Nombre y biografía
- **Especificaciones técnicas**: Dimensiones, técnica utilizada, año de creación
- **Categorización por estilos**: Sistema de clasificación artística
- **Obras únicas**: Cada pieza es una obra original con stock limitado

### 🛒 **Sistema de Compras Especializado**
- **Carrito elegante**: Interfaz diseñada para obras de arte
- **Validación de disponibilidad**: Control de obras únicas
- **Cálculo de precios**: Manejo de montos altos típicos del mercado artístico
- **Checkout completo**: Proceso optimizado para compras de arte

### 🎯 **Gestión de Obras (Para Artistas)**
- **Publicar obras**: Formulario especializado para artistas
- **Gestión de portfolio**: Control de obras propias
- **Información artística**: Campos específicos para técnica, dimensiones, año
- **Control de disponibilidad**: Manejo de obras vendidas o en exhibición

## 🛠️ **Tecnologías Utilizadas**

### **Frontend**
- **React 18** con hooks modernos
- **React Router DOM** para navegación
- **Context API** para estado global
- **Axios** para llamadas HTTP

### **Backend (Fake API)**
- **JSON-Server** para simular API REST
- **Persistencia de datos** en archivo db.json
### 🌐 **API Completa con JSON-Server**
- **Endpoints REST**: CRUD completo para obras, usuarios y categorías
- **Persistencia real**: Base de datos JSON que persiste entre reinicios
- **Validaciones**: Manejo de errores y respuestas HTTP
- **Interceptores**: Manejo automático de errores de autenticación
- **Endpoints automáticos** para todas las entidades

### 🎭 **Diseño y UX Especializado**
- **Estética de galería**: Diseño inspirado en galerías de arte profesionales
- **CSS personalizado** con variables CSS y paleta elegante
- **Diseño responsive** optimizado para la visualización de arte
- **Transiciones suaves** y efectos hover especializados
- **Tipografía artística** y espaciado generoso
- **Sistema de imágenes optimizado** con respaldo automático

## 🖼️ **Catálogo Artístico**

### **Obras Incluidas**
- **Colores Abstractos** - María González (Técnica mixta, 2024)
- **Sueño de Paisaje** - Carlos Mendoza (Óleo sobre lienzo, 2023)
- **Retrato Urbano** - Ana Silvestre (Acuarela sobre papel, 2024)
- **Sinfonía Geométrica** - Roberto Klein (Acrílico sobre lienzo, 2024)
- **Explosión Floral** - Isabella Torres (Técnica mixta, 2023)
- **Esencia Minimalista** - Diego Vargas (Óleo sobre lienzo, 2024)
- **Movimiento Contemporáneo** - Lucia Fernández (Acrílico sobre lienzo, 2024)
- **Sueños Texturizados** - Miguel Santos (Técnica mixta con texturas, 2023)

### **Estilos Artísticos**
- 🎨 **Abstracto** - Formas y colores que trascienden la realidad
- 🏞️ **Paisajes** - Belleza natural capturada en lienzo
- 👤 **Retratos** - Expresiones humanas en su máxima forma
- 🌿 **Naturaleza** - Vida y color en interpretaciones orgánicas
- ⚪ **Minimalista** - La belleza de la simplicidad y el espacio
- 📐 **Geométrico** - Armonía entre líneas, ángulos y espacios
- 🎭 **Contemporáneo** - Expresión moderna y dinámica
- 🔲 **Texturizado** - Relieves y texturas que invitan al tacto

## 📁 **Estructura del Proyecto**

```
src/
├── api/                    # Servicios de API
│   ├── index.js           # Configuración de axios
│   ├── auth.js            # Servicios de autenticación
│   ├── products.js        # Servicios de obras de arte
│   └── categories.js      # Servicios de categorías artísticas
├── components/             # Componentes reutilizables
│   ├── Navbar.jsx         # Navegación principal
│   ├── Footer.jsx         # Pie de página
│   ├── ProductCard.jsx    # Tarjeta de obra de arte
│   ├── Layout.jsx         # Layout principal
│   └── StockIndicator.jsx # Indicador de disponibilidad
├── context/               # Contextos de React
│   ├── UserContext.jsx    # Gestión de usuarios y artistas
│   ├── ProductContext.jsx # Gestión de obras de arte
│   └── CartContext.jsx    # Gestión del carrito de compras
├── pages/                 # Páginas de la aplicación
│   ├── LoginPage.jsx      # Página de acceso
│   ├── RegisterPage.jsx   # Registro de usuarios/artistas
│   ├── HomePage.jsx       # Página principal de la galería
│   ├── CatalogPage.jsx    # Catálogo completo de obras
│   ├── ProductPage.jsx    # Detalle de obra individual
│   ├── CartPage.jsx       # Carrito de compras
│   └── MyProductsPage.jsx # Panel del artista
├── data/                  # Datos estáticos
├── App.jsx                # Componente principal
├── main.jsx               # Punto de entrada
└── styles.css             # Estilos CSS personalizados
```

## 🚀 **Instalación y Uso**

### **Requisitos**
- Node.js 16+ 
- npm o yarn

### **Paso 1: Instalar dependencias**
```bash
npm install
```

### **Paso 2: Ejecutar la aplicación**
```bash
# Ejecutar servidor y frontend simultáneamente
npm run dev

# La aplicación estará disponible en:
# Frontend: http://localhost:5174
# API: http://localhost:5000
```

## 🔑 **Credenciales de Demo**

### **Usuario Admin/Artista**
- **Email**: admin@techparts.com
- **Contraseña**: admin123
- **Acceso**: Gestión completa de obras de arte

### **Usuario Coleccionista**
- **Email**: demo@techparts.com
- **Contraseña**: demo123
- **Acceso**: Navegación y compra de obras

## 📊 **Endpoints de la API**

### **Usuarios/Artistas**
- `GET /users` - Listar usuarios y artistas
- `POST /users` - Registro de nuevos usuarios
- `GET /users/:id` - Obtener perfil de usuario/artista

### **Obras de Arte**
- `GET /products` - Catálogo completo de obras
- `GET /products/:id` - Detalle de obra específica
- `POST /products` - Publicar nueva obra (artistas)
- `PUT /products/:id` - Actualizar información de obra
- `PATCH /products/:id` - Actualizar disponibilidad
- `DELETE /products/:id` - Retirar obra de la galería

### **Categorías Artísticas**
- `GET /categories` - Listar estilos artísticos
- `GET /categories/:id` - Obtener categoría específica

### **Carrito**
- `GET /cart` - Estado actual del carrito
- `POST /cart` - Agregar obra al carrito
- `PUT /cart` - Actualizar carrito
- `DELETE /cart` - Vaciar carrito

## 🎨 **Características del Diseño**

### **Inspiración Artística**
- **Uprise Art**: Elegancia y presentación profesional
- **Singulart**: Organización clara y navegación intuitiva
- **Galería MVP**: Funcionalidad completa con diseño sofisticado pero accesible

### **Paleta de Colores Artística**
- **Primario**: Dorado suave (#d4af37) - Elegancia artística
- **Secundario**: Azul marino (#1a365d) - Profesionalismo
- **Acento**: Verde esmeralda (#38a169) - Éxito y naturaleza
- **Neutros**: Grises cálidos y blancos cremosos para destacar las obras

### **UX Especializada**
- **Visualización de obras**: Imágenes de alta calidad con zoom
- **Información artística**: Datos detallados de cada pieza
- **Navegación por estilos**: Filtros intuitivos por categorías artísticas
- **Experiencia premium**: Diseño que refleja el valor del arte

### **Componentes Responsive**
- **Mobile-first**: Experiencia optimizada para dispositivos móviles
- **Grid de galería**: Layouts adaptativos para mostrar obras
- **Navegación táctil**: Interfaz optimizada para exploración artística

## 🔒 **Sistema de Seguridad y Validaciones**

### **Protección de Obras**
- **Validación de disponibilidad**: Control de obras únicas
- **Autenticación de artistas**: Gestión segura de portfolios
- **Protección de rutas**: Acceso condicional según roles

### **Manejo de Datos Artísticos**
- **Persistencia de información**: Metadatos completos de obras
- **Validación de precios**: Manejo de valores artísticos
- **Control de integridad**: Verificación de datos de artistas y obras

## 📱 **Responsive Design**

### **Breakpoints**
- **Desktop**: > 768px - Layout completo
- **Tablet**: 480px - 768px - Layout adaptado
- **Mobile**: < 480px - Layout móvil optimizado

### **Características Móviles**
- **Navegación**: Menú hamburguesa
- **Formularios**: Campos apilados verticalmente
- **Grids**: Columnas adaptativas
- **Touch**: Botones optimizados para pantalla táctil

## 🧪 **Testing y Debugging**

### **Herramientas de Desarrollo**
- **React DevTools**: Inspección de componentes
- **JSON-Server**: Logs de API en consola
- **LocalStorage**: Inspección de datos persistentes

### **Casos de Prueba**
1. **Registro de usuario nuevo**
2. **Login con credenciales válidas**
3. **Agregar productos al carrito**
4. **Modificar cantidades en carrito**
5. **Checkout completo con descuento de stock**
## 🔍 **Navegación y Funcionalidades**

### **Para Visitantes**
1. **Explorar galería** - Navegar por todas las obras disponibles
2. **Filtrar por estilo** - Buscar obras por categoría artística  
3. **Ver detalles** - Información completa de cada obra
4. **Registrarse** - Crear cuenta para comprar

### **Para Coleccionistas (Usuarios Registrados)**
5. **Agregar al carrito** - Seleccionar obras de interés
6. **Gestionar carrito** - Modificar selección y cantidades
7. **Proceso de compra** - Checkout completo
8. **Historial** - Ver compras realizadas

### **Para Artistas (Usuarios Admin)**
9. **Publicar obras** - Agregar nuevas piezas al catálogo
10. **Gestionar portfolio** - Editar información de obras propias
11. **Control de ventas** - Monitorear disponibilidad y ventas

## 🌟 **Características Especiales**

### **Optimizaciones de Imagen**
- **Sistema de respaldo**: Imágenes de fallback automático
- **Carga optimizada**: URLs optimizadas para mejor rendimiento
- **Placeholders visuales**: Patrones mientras cargan las imágenes
- **Responsive**: Adaptación automática a diferentes pantallas

### **Experiencia de Usuario Premium**
- **Navegación fluida**: Transiciones suaves entre páginas
- **Información rica**: Metadatos completos de cada obra
- **Diseño elegante**: Estética de galería profesional
- **Accesibilidad**: Diseño inclusivo y usable

## 🚀 **Deployment y Producción**

### **Build de Producción**
```bash
npm run build
```

### **Consideraciones para Producción**
- **API Real**: Migrar de JSON-Server a backend completo
- **Base de datos**: PostgreSQL/MySQL para persistencia robusta
- **Autenticación**: JWT o OAuth para seguridad avanzada
- **CDN**: Optimización de imágenes artísticas
- **SEO**: Meta tags y Open Graph para obras
- **Analytics**: Tracking de visualizaciones y ventas

## 🤝 **Contribución al Proyecto**

### **Áreas de Mejora**
- **Sistema de pagos**: Integración con Stripe/MercadoPago
- **Galería virtual**: Tours 3D o realidad aumentada
- **Certificados**: Blockchain para autenticidad de obras
- **Social**: Sistema de favoritos y wishlist
- **Mobile app**: Aplicación nativa complementaria

### **Estándares de Desarrollo**
- **React 18+**: Hooks modernos y mejores prácticas
- **ES6+**: Sintaxis moderna de JavaScript
- **CSS moderno**: Variables CSS y Grid/Flexbox
- **Responsive first**: Diseño mobile-first

## 📝 **Licencia y Uso**
Este proyecto es un MVP educativo bajo Licencia MIT, ideal para aprendizaje y desarrollo de portfolios.

## 📞 **Soporte**
Para consultas técnicas o colaboraciones, contactar al equipo de desarrollo.

---

## 🎯 **Estado del Proyecto: ✅ COMPLETO Y FUNCIONAL**

✅ **Sistema de autenticación completo**  
✅ **Catálogo de arte funcional**  
✅ **Carrito de compras operativo**  
✅ **Gestión de obras para artistas**  
✅ **Diseño responsive y elegante**  
✅ **API completa con JSON-Server**  
✅ **Sistema de imágenes optimizado**  
✅ **Experiencia de usuario premium**

✅ **Todas las fases implementadas**  
✅ **Sistema de stock funcional**  
✅ **API completa con JSON-Server**  
✅ **Autenticación y autorización**  
✅ **CRUD completo de productos**  
✅ **Carrito de compras funcional**  
✅ **Diseño responsive y moderno**  
✅ **Validaciones y manejo de errores**  

**El proyecto está listo para presentación y uso en producción (con backend real).**

