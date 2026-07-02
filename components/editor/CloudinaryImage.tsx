'use client'

import { CldImage } from 'next-cloudinary'

interface CloudinaryImageProps {
  publicId: string
  alt: string
  width?: number
  height?: number
  maxWidth?: number
  className?: string
  priority?: boolean
}

export default function CloudinaryImage({
  publicId,
  alt,
  width,
  height,
  maxWidth = 1200,
  className,
  priority,
}: CloudinaryImageProps) {
  return (
    <CldImage
      src={publicId}
      alt={alt}
      width={width ?? maxWidth}
      height={height ?? Math.round(maxWidth / (16 / 9))}
      sizes={`(max-width: ${maxWidth}px) 100vw, ${maxWidth}px`}
      className={className}
      priority={priority}
      format="auto"
      quality="auto"
    />
  )
}
