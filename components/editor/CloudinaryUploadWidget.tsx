'use client'

import { useRef, useState } from 'react'
import { Loader2, Upload } from 'lucide-react'
import { validateImage, resizeImageIfNeeded } from '@/lib/image'
import { uploadToCloudinary } from '@/app/dashboard/articles/actions'

interface CloudinaryUploadWidgetProps {
  folder: 'header' | 'cuerpo'
  onUpload: (publicId: string) => void
  onError?: (error: string) => void
  trigger: React.ReactNode
  disabled?: boolean
}

export default function CloudinaryArticleUpload({
  folder,
  onUpload,
  onError,
  trigger,
  disabled,
}: CloudinaryUploadWidgetProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || uploading) return

    const validation = validateImage(file)
    if (!validation.valid) {
      onError?.(validation.error!)
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    setUploading(true)

    try {
      const resizedFile = await resizeImageIfNeeded(file)

      const formData = new FormData()
      formData.set('file', resizedFile)
      formData.set('folder', folder)

      const publicId = await uploadToCloudinary(formData)
      onUpload(publicId)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al subir la imagen'
      onError?.(msg)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelected}
      />
      <span
        onClick={() => {
          if (disabled || uploading) return
          inputRef.current?.click()
        }}
      >
        {uploading ? (
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Subiendo...
          </span>
        ) : (
          trigger
        )}
      </span>
    </>
  )
}
