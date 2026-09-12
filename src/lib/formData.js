/**
 * Builds a FormData object from a plain object, correctly handling File
 * instances, booleans, arrays/objects (JSON-encoded) and Laravel's
 * "POST + _method spoof" pattern needed for multipart PUT/PATCH requests.
 */
export function toFormData(data, { method } = {}) {
  const formData = new FormData()

  if (method) {
    formData.append('_method', method)
  }

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return

    if (value instanceof File) {
      formData.append(key, value)
    } else if (typeof value === 'boolean') {
      formData.append(key, value ? '1' : '0')
    } else if (Array.isArray(value) || typeof value === 'object') {
      formData.append(key, JSON.stringify(value))
    } else {
      formData.append(key, value)
    }
  })

  return formData
}
