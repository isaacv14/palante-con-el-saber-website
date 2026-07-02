const MAX_DIMENSION = 2000
const MAX_FILE_SIZE = 10 * 1024 * 1024

export interface ValidationResult {
  valid: boolean
  error?: string
}

export function validateImage(file: File): ValidationResult {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `La imagen supera el límite de 10MB. Tamaño actual: ${(file.size / (1024 * 1024)).toFixed(1)}MB.`,
    }
  }
  return { valid: true }
}

export function resizeImageIfNeeded(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      let { width, height } = img

      if (width <= MAX_DIMENSION && height <= MAX_DIMENSION) {
        resolve(file)
        return
      }

      if (width > height) {
        height = Math.round((height / width) * MAX_DIMENSION)
        width = MAX_DIMENSION
      } else {
        width = Math.round((width / height) * MAX_DIMENSION)
        height = MAX_DIMENSION
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('No se pudo crear el contexto del canvas'))
        return
      }
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('No se pudo generar el blob de la imagen'))
            return
          }
          const resized = new File([blob], file.name, { type: file.type })
          resolve(resized)
        },
        file.type,
        0.92,
      )
    }
    img.onerror = () => reject(new Error('No se pudo cargar la imagen'))
    img.src = URL.createObjectURL(file)
  })
}
