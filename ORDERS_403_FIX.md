# Fix para Error 403 en Orders API

## Problema
El endpoint `/pedidos/usuario/{userId}` está devolviendo 403 Forbidden, indicando que el usuario no tiene permisos para acceder a sus propias órdenes.

## Posibles Causas
1. **Backend Security**: El endpoint requiere roles específicos (ADMIN, MANAGER) y no permite acceso con rol USER
2. **JWT Configuration**: El token JWT no contiene los claims correctos para autorización
3. **Endpoint Configuration**: El endpoint puede estar mal configurado en el backend Spring Boot

## Solución Implementada (Frontend)
1. **Manejo Graceful**: Se muestra mensaje user-friendly para error 403
2. **Fallback State**: La aplicación funciona sin historial de órdenes
3. **Error Boundary**: Los errores no rompen la aplicación

## Solución Requerida (Backend)
```java
// En el controlador de pedidos, asegurar que USER puede acceder a sus propias órdenes
@GetMapping("/usuario/{userId}")
@PreAuthorize("hasRole('USER') and #userId == authentication.principal.id or hasRole('ADMIN')")
public ResponseEntity<List<Pedido>> getPedidosByUsuario(@PathVariable Long userId) {
    // implementación
}
```

## Estado Actual
- ✅ Frontend maneja el error 403 gracefully
- ❌ Backend requiere configuración de autorización
- ⚠️ Los usuarios no pueden ver su historial de compras

## Próximos Pasos
1. Revisar configuración de seguridad en el backend
2. Verificar que el JWT incluye el user ID correcto
3. Ajustar autorización para permitir acceso a órdenes propias