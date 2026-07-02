'use client'

import type { Editor } from '@tiptap/react'
import { Image } from 'lucide-react'
import CloudinaryArticleUpload from './CloudinaryUploadWidget'

interface ImageUploadButtonProps {
  editor: Editor
  articleId?: string
}

export default function ImageUploadButton({ editor }: ImageUploadButtonProps) {
  function handleUpload(publicId: string) {
    editor
      .chain()
      .focus()
      .setFigure({ src: publicId, alt: '' })
      .run()
  }

  return (
    <CloudinaryArticleUpload
      folder="cuerpo"
      onUpload={handleUpload}
      trigger={
        <button
          type="button"
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          title="Insertar imagen"
        >
          <Image className="size-4" />
        </button>
      }
    />
  )
}
