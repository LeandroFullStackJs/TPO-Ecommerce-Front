# Configuración del Frontend para Backend Spring Boot

## ✅ Configuración Completada

El frontend ha sido configurado exitosamente para usar el backend de Spring Boot que corre en `http://localhost:8080/api`.

### 📁 Archivos Actualizados

#### 1. **`src/api/index.js`** - Configuración Principal
- ✅ URL base cambiada a `http://localhost:8080/api`
- ✅ Interceptor de peticiones añadido para JWT tokens automáticos
- ✅ Interceptor de respuestas mejorado para manejo de errores 401
- ✅ Configuración automática de token al inicializar la app

#### 2. **`src/api/auth.js`** - Autenticación
- ✅ Endpoints actualizados para Spring Boot:
  - `POST /auth/login` - Inicio de sesión
  - `POST /auth/register` - Registro de usuarios
  - `GET /usuarios/me` - Usuario actual
  - `GET /usuarios/{id}` - Usuario por ID
  - `PUT /usuarios/{id}` - Actualizar usuario
  - `PATCH /usuarios/{id}/password` - Cambiar contraseña
- ✅ Manejo automático de JWT tokens
- ✅ Manejo mejorado de errores con try/catch

#### 3. **`src/api/products.js`** - Gestión de Productos
- ✅ Endpoints actualizados:
  - `GET /productos` - Todos los productos
  - `GET /productos/{id}` - Producto por ID
  - `POST /productos` - Crear producto
  - `PUT /productos/{id}` - Actualizar producto
  - `DELETE /productos/{id}` - Eliminar producto
  - `GET /productos/categoria/{id}` - Productos por categoría
  - `GET /productos/artista/{id}` - Productos por artista
  - `GET /productos/buscar?q=` - Buscar productos

#### 4. **`src/api/categories.js`** - Categorías
- ✅ Endpoints actualizados:
  - `GET /categorias` - Todas las categorías
  - `GET /categorias/{id}` - Categoría por ID

#### 5. **`src/api/artists.js`** - Artistas
- ✅ Endpoints actualizados:
  - `GET /artistas` - Todos los artistas
  - `GET /artistas/{id}` - Artista por ID
  - `POST /artistas` - Crear artista
  - `PUT /artistas/{id}` - Actualizar artista
  - `DELETE /artistas/{id}` - Eliminar artista
  - `GET /artistas/categoria/{id}` - Artistas por categoría
  - `GET /artistas/buscar?q=` - Buscar artistas

#### 6. **`src/api/orders.js`** - Órdenes/Pedidos
- ✅ Endpoints actualizados:
  - `GET /pedidos/usuario/{id}` - Pedidos por usuario
  - `POST /pedidos` - Crear pedido
  - `GET /pedidos/{id}` - Pedido por ID
  - `PATCH /pedidos/{id}/estado` - Actualizar estado

#### 7. **`src/api/hero.js`** - Contenido Hero
- ✅ Endpoints actualizados:
  - `GET /hero-images` - Imágenes hero
  - `GET /banners-promocionales` - Banners promocionales
  - `GET /contenido-destacado` - Contenido destacado

### 🔧 Características Implementadas

#### Autenticación JWT
- ✅ Almacenamiento automático de tokens en localStorage
- ✅ Inclusión automática de tokens en todas las peticiones
- ✅ Limpieza automática al recibir errores 401
- ✅ Redirección automática al login cuando expira la sesión

#### Manejo de Errores
- ✅ Try/catch en todos los métodos de API
- ✅ Mensajes de error descriptivos
- ✅ Logging centralizado de errores
- ✅ Propagación correcta de errores para componentes

#### Estructura Consistente
- ✅ Todos los archivos siguen el mismo patrón de estructura
- ✅ Documentación JSDoc completa
- ✅ Nombres de métodos descriptivos y consistentes
- ✅ Validación de parámetros y respuestas

### 🚀 Próximos Pasos

1. **Iniciar el Backend**: Asegúrate de que tu backend Spring Boot esté corriendo en `http://localhost:8080`

2. **Verificar Endpoints**: Los endpoints del frontend ahora coinciden con la estructura típica de Spring Boot:
   - `/api/auth/*` para autenticación
   - `/api/productos/*` para productos
   - `/api/categorias/*` para categorías
   - `/api/artistas/*` para artistas
   - `/api/pedidos/*` para pedidos

3. **Probar la Conexión**: Puedes probar la conexión ejecutando el frontend:
   ```bash
   npm run dev
   ```

4. **Ajustar Endpoints**: Si los endpoints de tu backend son diferentes, puedes ajustarlos fácilmente en los archivos de `/src/api/`.

### ⚠️ Notas Importantes

- **CORS**: Asegúrate de que tu backend permita conexiones desde `http://localhost:5173` (puerto por defecto de Vite)
- **Estructura de Datos**: Verifica que la estructura de datos que devuelve tu backend coincida con lo que espera el frontend
- **Códigos de Estado**: El frontend está configurado para manejar códigos de estado HTTP estándar (200, 401, 404, 500, etc.)

### 🔍 Testing

Para probar que la configuración funciona:

1. Abre las DevTools del navegador
2. Ve a la pestaña Network
3. Intenta hacer login o navegar por la aplicación
4. Verifica que las peticiones se dirijan a `http://localhost:8080/api/*`
5. Verifica que se incluya el header `Authorization: Bearer <token>` en las peticiones autenticadas

¡La configuración está lista para usar con tu backend de Spring Boot! 🎉