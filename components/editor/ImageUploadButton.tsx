'use client'

import { useRef } from 'react'
import type { Editor } from '@tiptap/react'
import { supabase } from '@/lib/supabase/client'
import { Image } from 'lucide-react'

interface ImageUploadButtonProps {
  editor: Editor
  articleId: string
}

export default function ImageUploadButton({ editor, articleId }: ImageUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const timestamp = Date.now()
    const ext = file.name.split('.').pop()
    const fileName = `${timestamp}.${ext}`
    const filePath = `article-body-images/${articleId}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('article-body-images')
      .upload(filePath, file)

    if (uploadError) {
      console.error('Error al subir la imagen:', uploadError.message)
      return
    }

    const { data: urlData } = supabase.storage
      .from('article-body-images')
      .getPublicUrl(filePath)

    editor
      .chain()
      .focus()
      .setFigure({ src: urlData.publicUrl, alt: '' })
      .run()

    if (inputRef.current) {
      inputRef.current.value = ''
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
        className="inline-flex size-8 items-center justify-center rounded-md text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        title="Insertar imagen"
      >
        <Image className="size-4" />
      </button>
    </>
  )
}
