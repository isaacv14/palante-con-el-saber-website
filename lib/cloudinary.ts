const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!

export function getCloudinaryUrl(
  publicId: string,
  options?: { width?: number; height?: number; fetchFormat?: boolean; quality?: string },
): string {
  const transformations: string[] = []

  if (options?.fetchFormat !== false) {
    transformations.push('f_auto')
  }
  if (options?.quality !== undefined) {
    transformations.push(`q_${options.quality}`)
  } else {
    transformations.push('q_auto')
  }
  if (options?.width) {
    transformations.push(`w_${options.width}`)
  }
  if (options?.height) {
    transformations.push(`h_${options.height}`)
  }

  const tx = transformations.length > 0 ? `${transformations.join(',')}/` : ''
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${tx}${publicId}`
}

export function isCloudinaryPublicId(value: string): boolean {
  return value.startsWith('palante/')
}
