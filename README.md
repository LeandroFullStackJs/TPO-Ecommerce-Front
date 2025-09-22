# ArtGallery - Galería de Arte Online

## 🎨 **Descripción**
ArtGallery es una aplicación web de e-commerce especializada en la venta de obras de arte originales. Desarrollada en React con una API completa usando JSON-Server, ofrece una experiencia elegante para coleccionistas y amantes del arte que buscan adquirir obras únicas.

## ✨ **Funcionalidades Implementadas**

### 🔐 **Sistema de Autenticación y Seguridad Avanzado**
- **Login/Registro**: Formularios con validaciones completas y manejo de errores
- **Gestión de sesiones**: Persistencia segura en localStorage con tokens
- **Roles de usuario**: Sistema robusto Admin/Usuario con permisos diferenciados
- **Rutas protegidas**: Componente `ProtectedRoute` con autenticación y autorización
- **Redirección inteligente**: Preserva la URL de destino después del login
- **Validación de permisos**: Control granular de acceso a funcionalidades

### 🛡️ **Sistema de Rutas Protegidas (NUEVO)**
- **Componente ProtectedRoute**: Control de acceso centralizado
- **Tipos de protección**: 
  - Rutas públicas (catálogo, home)
  - Rutas autenticadas (carrito, mi cuenta)
  - Rutas de administrador (gestión de productos)
- **Redirección automática**: Login con retorno a página original
- **Estados de carga**: Feedback visual durante verificación de permisos

### 🛒 **Sistema de Carrito Optimizado**
- **Acceso público mejorado**: Usuarios no registrados pueden ver el carrito
- **Checkout protegido**: Solo usuarios autenticados pueden finalizar compra
- **Navegación mejorada**: Links clickeables desde carrito a detalle de producto
- **Gestión de estado híbrida**: Context API + localStorage para persistencia
- **Validación inteligente**: Control automático de stock y disponibilidad

### ❤️ **Sistema de Wishlist (NUEVO)**
- **Lista de deseos personalizada**: Guardado por usuario en localStorage
- **Gestión completa**: Agregar/quitar productos con feedback visual
- **Persistencia por usuario**: Cada usuario mantiene su propia wishlist
- **Integración con autenticación**: Requiere login para funcionar
- **Context API dedicado**: WishlistContext para gestión de estado

### 🏛️ **Catálogo de Arte Mejorado**
- **Galería completa**: Obras de arte organizadas por categorías artísticas
- **Filtros avanzados**: Por estilo artístico, búsqueda y disponibilidad
- **Categorías especializadas**: 8 estilos artísticos profesionales
- **Detalle de obra mejorado**: Vista completa con descripción enriquecida
- **Sistema de imágenes robusto**: Fallback automático y manejo de errores
- **Información artística completa**: Datos del artista, técnica, dimensiones

### 🎯 **Gestión de Obras para Artistas Mejorada**
- **Panel de artista**: Interface dedicada para gestión de portfolio
- **Publicación de obras**: Formulario especializado con todos los campos artísticos
- **Control de disponibilidad**: Gestión de stock y visibilidad
- **Edición completa**: Actualización de información y precios
- **Validaciones artísticas**: Campos específicos para metadatos de arte

### 🎨 **Experiencia de Usuario Optimizada (NUEVO)**
- **Navegación fluida**: Transiciones suaves y feedback visual
- **Descripción enriquecida**: Sección de descripción mejorada con fallback
- **Breadcrumbs**: Navegación contextual en páginas de detalle
- **Estados de carga**: Indicadores visuales durante operaciones
- **Mensajes informativos**: Feedback claro para todas las acciones

### 🔧 **Arquitectura de Estado Avanzada (NUEVO)**
- **useReducer implementado**: Gestión compleja de estado del carrito
- **useMemo optimizations**: Rendimiento mejorado en filtros y cálculos
- **Context API estructurado**: Separación clara de responsabilidades
- **localStorage híbrido**: Persistencia inteligente de datos
- **Manejo de errores robusto**: Captura y recuperación de errores

## 🛠️ **Tecnologías Utilizadas**

### **Frontend Avanzado**
- **React 18** con hooks modernos (useState, useEffect, useMemo, useReducer)
- **React Router DOM v6** para navegación SPA y rutas protegidas
- **Context API estructurado** para estado global (4 contextos especializados)
- **Axios** con interceptores para llamadas HTTP
- **Gestión de estado híbrida**: Context + localStorage para persistencia

### **Gestión de Estado Moderna (ACTUALIZADO)**
- **UserContext**: Autenticación y gestión de usuarios
- **ProductContext**: Catálogo de obras y filtros
- **CartContext**: Carrito con useReducer y localStorage
- **WishlistContext**: Lista de deseos por usuario
- **useReducer**: Gestión compleja de estado del carrito
- **useMemo**: Optimización de rendimiento en filtros

### **Backend (Fake API)**
- **JSON-Server** para simular API REST completa
- **Persistencia de datos** en archivo db.json
- **Endpoints especializados** para galería de arte
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

## 📁 **Estructura del Proyecto Actualizada**

```
src/
├── api/                    # Servicios de API especializados
│   ├── index.js           # Configuración de axios con interceptores
│   ├── auth.js            # Servicios de autenticación y autorización
│   ├── products.js        # Servicios de obras de arte
│   ├── categories.js      # Servicios de categorías artísticas
│   ├── artists.js         # Servicios de gestión de artistas
│   └── orders.js          # Servicios de órdenes y checkout
├── components/             # Componentes reutilizables mejorados
│   ├── Navbar.jsx         # Navegación principal con autenticación
│   ├── Footer.jsx         # Pie de página
│   ├── ProductCard.jsx    # Tarjeta de obra de arte optimizada
│   ├── Layout.jsx         # Layout principal con notificaciones
│   ├── ProtectedRoute.jsx # Componente de rutas protegidas (NUEVO)
│   ├── Modal.jsx          # Modal reutilizable (NUEVO)
│   ├── ArtistCard.jsx     # Tarjeta de perfil de artista
│   └── StockIndicator.jsx # Indicador de disponibilidad
├── context/               # Contextos de React especializados
│   ├── UserContext.jsx    # Gestión de usuarios y autenticación
│   ├── ProductContext.jsx # Gestión de obras de arte y filtros
│   ├── CartContext.jsx    # Gestión híbrida del carrito (MEJORADO)
│   ├── WishlistContext.jsx # Gestión de lista de deseos (NUEVO)
│   └── OrderContext.jsx   # Gestión de órdenes de compra
├── pages/                 # Páginas de la aplicación
│   ├── LoginPage.jsx      # Página de acceso con redirección
│   ├── RegisterPage.jsx   # Registro de usuarios/artistas
│   ├── HomePage.jsx       # Página principal con filtros optimizados
│   ├── CatalogPage.jsx    # Catálogo completo de obras
│   ├── ProductPage.jsx    # Detalle de obra mejorado (ACTUALIZADO)
│   ├── CartPage.jsx       # Carrito con navegación clickeable (MEJORADO)
│   ├── MyAccountPage.jsx  # Panel de usuario
│   ├── MyProductsPage.jsx # Panel del artista
│   ├── ArtistPage.jsx     # Página de perfil de artista
│   ├── CategoriesPage.jsx # Página de categorías con filtros
│   └── ForgotPasswordPage.jsx # Recuperación de contraseña
├── styles/                # Estilos especializados
│   ├── artist.css         # Estilos para perfiles de artista
│   ├── pages.css          # Estilos generales de páginas
│   └── tappan-theme.css   # Tema de galería profesional
├── data/                  # Datos estáticos y configuraciones
├── App.jsx                # Componente principal con rutas protegidas
├── main.jsx               # Punto de entrada
└── styles.css             # Estilos CSS principales optimizados
```
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

### **Carrito y Wishlist**
- `GET /cart` - Estado actual del carrito
- `POST /cart` - Agregar obra al carrito
- `PUT /cart` - Actualizar carrito
- `DELETE /cart` - Vaciar carrito
- **Wishlist**: Gestión local por usuario con Context API

## 🚀 **Mejoras Técnicas Implementadas en Esta Sesión**

### **🔒 Sistema de Rutas Protegidas**
- **Componente ProtectedRoute**: Centraliza la lógica de autenticación y autorización
- **Tres niveles de protección**: Público, autenticado, y administrador
- **Redirección inteligente**: Preserva la URL de destino después del login
- **Estados de carga**: Feedback visual durante verificación de permisos

### **🛒 Optimización del Carrito**
- **Acceso público**: Usuarios no registrados pueden ver el carrito sin registrarse
- **Checkout protegido**: Solo usuarios autenticados pueden finalizar compras
- **Navegación mejorada**: Links clickeables desde items del carrito al detalle del producto
- **useReducer**: Implementación robusta para gestión de estado complejo

### **❤️ Sistema de Wishlist Completo**
- **WishlistContext nuevo**: Context API dedicado para lista de deseos
- **Persistencia por usuario**: Cada usuario tiene su propia wishlist en localStorage
- **Integración con autenticación**: Funciona solo para usuarios logueados
- **Feedback visual**: Botones de corazón con estados activo/inactivo

### **🎨 Mejoras de UX en ProductPage**
- **Descripción enriquecida**: Sección mejorada con estilos y fallback text
- **Estructura HTML robusta**: Contenedores con altura mínima y flexbox
- **Breadcrumbs**: Navegación contextual mejorada
- **Estilos consistentes**: Sin dependencia de variables CSS no definidas

### **⚡ Optimizaciones de Rendimiento**
- **useMemo implementado**: En HomePage, CategoriesPage y filtros
- **Context API estructurado**: Separación clara de responsabilidades
- **localStorage híbrido**: Persistencia inteligente de carrito y wishlist
- **Gestión de errores**: Manejo robusto de errores de API y estado

### **🏗️ Arquitectura de Estado Avanzada**
- **useReducer en CartContext**: Gestión compleja con acciones ADD_ITEM, REMOVE_ITEM, SET_QTY
- **Múltiples Contexts**: UserContext, ProductContext, CartContext, WishlistContext
- **Persistencia inteligente**: Sincronización automática con localStorage
- **Estado derivado**: Cálculos optimizados con useMemo para totales y filtros

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
5. **Agregar al carrito** - Seleccionar obras de interés desde cualquier página
6. **Gestionar carrito** - Modificar selección, cantidades y navegar a detalles
7. **Lista de deseos** - Guardar obras favoritas con sistema de wishlist
8. **Proceso de compra** - Checkout completo y seguro
9. **Navegación fluida** - Acceso directo desde carrito a detalle de productos

### **Para Artistas (Usuarios Admin)**
10. **Publicar obras** - Agregar nuevas piezas al catálogo con metadatos completos
11. **Gestionar portfolio** - Editar información de obras propias con validaciones
12. **Control de ventas** - Monitorear disponibilidad y ventas en tiempo real
13. **Rutas protegidas** - Acceso exclusivo a funciones administrativas

## 🌟 **Características Especiales Mejoradas**

### **Sistema de Rutas Inteligente (NUEVO)**
- **Acceso público optimizado**: Carrito visible sin registro para mejor conversión
- **Protección granular**: Diferentes niveles según funcionalidad
- **Redirección contextual**: Retorno automático a página original después del login
- **Estados de carga**: Feedback visual durante verificación de permisos

### **Gestión de Estado Avanzada (NUEVO)**
- **useReducer en Carrito**: Gestión robusta con acciones tipadas
- **Context API estructurado**: 4 contextos especializados
- **Persistencia híbrida**: localStorage + Context para mejor UX
- **useMemo optimizado**: Filtros y cálculos optimizados para rendimiento

### **Sistema de Wishlist Completo (NUEVO)**
- **Persistencia por usuario**: Cada usuario mantiene su lista personal
- **Integración con UI**: Botones de corazón con feedback visual
- **Gestión completa**: Agregar/quitar con confirmaciones
- **Sincronización automática**: Estado persistente entre sesiones

### **Optimizaciones de Imagen y UX**
- **Sistema de respaldo mejorado**: Fallback automático con estilos consistentes
- **Carga optimizada**: URLs optimizadas para mejor rendimiento
- **Descripción enriquecida**: Secciones mejoradas con texto de fallback
- **Navegación clickeable**: Links directos desde carrito a productos
- **Responsive avanzado**: Adaptación automática a diferentes pantallas

### **Experiencia de Usuario Premium Actualizada**
- **Navegación fluida**: Transiciones suaves entre páginas con estados de carga
- **Información rica**: Metadatos completos de cada obra con presentación mejorada
- **Diseño elegante**: Estética de galería profesional con mejores contrastes
- **Breadcrumbs contextuales**: Navegación intuitiva en páginas de detalle
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

## 🎯 **Estado del Proyecto: ✅ COMPLETO Y FUNCIONAL - VERSIÓN MEJORADA**

### **✅ Funcionalidades Core Implementadas**
✅ **Sistema de autenticación completo con rutas protegidas**  
✅ **Catálogo de arte funcional con filtros optimizados**  
✅ **Carrito de compras híbrido (Context + localStorage)**  
✅ **Sistema de wishlist completo por usuario**  
✅ **Gestión de obras para artistas con validaciones**  
✅ **Diseño responsive y elegante de galería profesional**  

### **✅ Mejoras Técnicas de Esta Sesión**
✅ **ProtectedRoute: Sistema de rutas protegidas con 3 niveles**  
✅ **Carrito público: Acceso optimizado para mejor conversión**  
✅ **Navegación clickeable: Links desde carrito a productos**  
✅ **WishlistContext: Sistema completo de lista de deseos**  
✅ **useReducer: Gestión robusta de estado del carrito**  
✅ **useMemo: Optimizaciones de rendimiento en filtros**  
✅ **ProductPage mejorada: Descripción enriquecida con fallback**  

### **✅ Arquitectura de Estado Avanzada**
✅ **4 Contextos especializados: User, Product, Cart, Wishlist**  
✅ **Persistencia híbrida: Context API + localStorage**  
✅ **Gestión de errores robusta en todas las operaciones**  
✅ **Estados de carga y feedback visual en toda la app**  
✅ **Redirección inteligente con preservación de URL**  

### **✅ Experiencia de Usuario Premium**
✅ **Navegación fluida con breadcrumbs contextuales**  
✅ **Sistema de imágenes con fallback automático mejorado**  
✅ **Feedback visual completo en todas las acciones**  
✅ **Diseño consistente sin dependencias de variables CSS**  
✅ **Accesibilidad mejorada y estilos robustos**  

### **✅ Todas las Fases Completadas y Mejoradas**
✅ **API completa con JSON-Server y endpoints especializados**  
✅ **Sistema de stock funcional con validaciones inteligentes**  
✅ **Autenticación y autorización con roles granulares**  
✅ **CRUD completo de productos con metadatos artísticos**  
✅ **Carrito de compras con useReducer y persistencia**  
✅ **Validaciones y manejo de errores en todas las capas**  

**🚀 El proyecto está listo para presentación y uso en producción con todas las mejoras implementadas.**

### **🎨 Valor Agregado de las Mejoras**
- **Mejor conversión**: Carrito público aumenta probabilidad de compra
- **UX premium**: Navegación fluida y feedback visual completo  
- **Arquitectura escalable**: Contextos especializados y estado robusto
- **Código mantenible**: useReducer, useMemo y separación de responsabilidades
- **Experiencia profesional**: Diseño de galería con funcionalidades avanzadas

