'use client'

import { useRef, useState } from 'react'
import type { Editor } from '@tiptap/react'
import { Image, Loader2 } from 'lucide-react'
import { uploadArticleBodyImage } from '@/app/dashboard/articles/actions'

interface ImageUploadButtonProps {
  editor: Editor
  articleId: string
}

export default function ImageUploadButton({ editor, articleId }: ImageUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || uploading) return

    setUploading(true)

    const formData = new FormData()
    formData.set('file', file)

    try {
      const url = await uploadArticleBodyImage(articleId, formData)

      editor
        .chain()
        .focus()
        .setFigure({ src: url, alt: '' })
        .run()
    } catch (err) {
      console.error('Error al subir la imagen:', err)
    } finally {
      setUploading(false)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="inline-flex size-8 items-center justify-center rounded-md text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
        title="Insertar imagen"
      >
        {uploading ? <Loader2 className="size-4 animate-spin" /> : <Image className="size-4" />}
      </button>
    </>
  )
}
