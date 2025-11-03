import api from './index'

/**
 * Convierte dirección del backend (snake_case) al formato del frontend (camelCase)
 */
const normalizeAddress = (addr) => {
  if (!addr) return null
  return {
    id: addr.id,
    calle: addr.calle,
    numero: addr.numero,
    localidad: addr.localidad,
    provincia: addr.provincia,
    pais: addr.pais,
    codigoPostal: addr.codigo_postal || addr.codigoPostal,
    observaciones: addr.observaciones,
    esPrincipal: addr.es_principal !== undefined ? !!addr.es_principal : addr.esPrincipal,
    usuarioId: addr.usuario_id || addr.usuarioId
  }
}

/**
 * Convierte dirección del frontend (camelCase) al formato del backend (snake_case)
 * @param {Object} addr - Dirección en formato frontend
 * @param {boolean} includeUserId - Si incluir usuario_id (por defecto false, el backend lo toma del token)
 */
const toBackendFormat = (addr, includeUserId = false) => {
  if (!addr) return null
  const formatted = {
    id: addr.id,
    calle: addr.calle,
    numero: addr.numero,
    localidad: addr.localidad,
    provincia: addr.provincia,
    pais: addr.pais,
    codigo_postal: addr.codigoPostal || addr.codigo_postal,
    observaciones: addr.observaciones,
    es_principal: addr.esPrincipal !== undefined ? !!addr.esPrincipal : addr.es_principal
  }
  // Solo incluir usuario_id si se solicita explícitamente
  // Normalmente NO se incluye porque el backend lo obtiene del token JWT
  if (includeUserId && (addr.usuarioId || addr.usuario_id)) {
    formatted.usuario_id = addr.usuarioId || addr.usuario_id
  }
  return formatted
}

// API de direcciones del usuario (según backend real)
export const addressesAPI = {
  // Lista las direcciones del usuario autenticado (usa endpoint específico)
  async listMine() {
    // El backend obtiene el usuarioId del token JWT automáticamente
    const { data } = await api.get('/direcciones/mias')
    const addresses = Array.isArray(data) ? data : []
    return addresses.map(normalizeAddress).filter(Boolean)
  },

  // Obtiene una dirección por id
  async getById(addressId) {
    if (!addressId) throw new Error('Falta addressId')
    const { data } = await api.get(`/direcciones/${addressId}`)
    return normalizeAddress(data)
  },

  // Crea una dirección. El usuarioId se obtiene automáticamente del token JWT
  async create(address) {
    // usuarioId ya NO es necesario, el backend lo toma del token JWT
    const backendFormat = toBackendFormat(address, false) // No incluir usuario_id
    const { data } = await api.post('/direcciones', backendFormat)
    return normalizeAddress(data)
  },

  // Actualiza una dirección existente
  async update(addressId, address) {
    if (!addressId) throw new Error('Falta addressId')
    const backendFormat = toBackendFormat(address)
    const { data } = await api.put(`/direcciones/${addressId}`, backendFormat)
    return normalizeAddress(data)
  },

  // Elimina una dirección
  async remove(addressId) {
    if (!addressId) throw new Error('Falta addressId')
    await api.delete(`/direcciones/${addressId}`)
    return true
  },

  // Marca una dirección como principal (esPrincipal: true)
  async setPrimary(addressId) {
    if (!addressId) throw new Error('Falta addressId')
    // Estrategia: obtener, set esPrincipal y hacer PUT
    const current = await this.getById(addressId)
    const payload = { ...current, esPrincipal: true }
    const backendFormat = toBackendFormat(payload)
    const { data } = await api.put(`/direcciones/${addressId}`, backendFormat)
    return normalizeAddress(data)
  }
}


