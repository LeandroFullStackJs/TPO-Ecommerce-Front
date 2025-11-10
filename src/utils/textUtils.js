/**
 * UTILIDADES PARA NORMALIZACIÓN DE TEXTO
 * 
 * Funciones auxiliares para manejar búsquedas de texto
 * con tolerancia a acentos y caracteres especiales.
 */

/**
 * Normaliza texto removiendo acentos y caracteres especiales
 * @param {string} text - Texto a normalizar
 * @returns {string} Texto normalizado
 */
export function normalizeText(text) {
  if (!text) return ''
  
  return text
    .toLowerCase()
    .normalize('NFD') // Descompone caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Remueve diacríticos
    .replace(/[^\w\s]/g, '') // Remueve caracteres especiales
    .trim()
}

/**
 * Corrige caracteres mal codificados (UTF-8 mal interpretado)
 * @param {string} text - Texto con posibles errores de codificación
 * @returns {string} Texto con codificación corregida
 */
export function fixEncoding(text) {
  if (!text) return ''
  
  const fixes = {
    'Ã­': 'í',
    'Ã¡': 'á',
    'Ã©': 'é',
    'Ã³': 'ó',
    'Ãº': 'ú',
    'Ã±': 'ñ',
    'Ã': 'Í',
    'Ã': 'Á',
    'Ã': 'É',
    'Ã': 'Ó',
    'Ã': 'Ú',
    'Ã': 'Ñ'
  }
  
  let correctedText = text
  Object.entries(fixes).forEach(([wrong, correct]) => {
    correctedText = correctedText.replace(new RegExp(wrong, 'g'), correct)
  })
  
  return correctedText
}

/**
 * Compara dos textos de manera tolerante a acentos y errores de codificación
 * @param {string} text - Texto donde buscar
 * @param {string} search - Término de búsqueda
 * @returns {boolean} True si hay coincidencia
 */
export function textIncludes(text, search) {
  if (!text || !search) return false
  
  // Corregir errores de codificación primero
  const fixedText = fixEncoding(text)
  
  const normalizedText = normalizeText(fixedText)
  const normalizedSearch = normalizeText(search)
  
  return normalizedText.includes(normalizedSearch)
}