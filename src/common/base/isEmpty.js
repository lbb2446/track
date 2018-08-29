
/**
 *
 * @param {*} value 要校验的值
 */
export default function _isEmpty (value) {
  if (value === null || value === undefined) {
    return true
  }
  if (typeof value === 'number') {
    return isNaN(value)
  }
  if (Array.isArray(value) || typeof value === 'string' || typeof value.splice === 'function') {
    return !value.length
  }
  if (typeof value === 'object') {
    for (const key in value) {
      if (hasOwnProperty.call(value, key)) {
        return false
      }
    }
  }
  return true
}
