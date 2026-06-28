'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import ArticleEditor from '@/components/editor/ArticleEditor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Image, Save, Send } from 'lucide-react'
import { createArticle, updateArticle } from '../actions'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-áéíóúüñ]/g, '')
    .replace(/[\s]+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export default function NewArticlePage() {
  const router = useRouter()
  const [articleId, setArticleId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [body, setBody] = useState<unknown>(null)
  const [slug, setSlug] = useState('')
  const [headerFile, setHeaderFile] = useState<File | null>(null)
  const [headerPreview, setHeaderPreview] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const draftCreated = useRef(false)

  useEffect(() => {
    if (draftCreated.current) return
    draftCreated.current = true

    async function init() {
      try {
        const result = await createArticle({
          title: '',
          summary: '',
          status: 'draft',
        })
        setArticleId(result.id)
        setSlug(result.slug)
      } catch (err) {
        console.error('Error al crear borrador:', err)
      }
    }

    init()
  }, [])

  function handleHeaderChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setHeaderFile(file)
    setHeaderPreview(URL.createObjectURL(file))
  }

  function handleTitleChange(value: string) {
    setTitle(value)
    if (value.trim()) {
      setSlug(slugify(value))
    }
  }

  async function uploadHeader(articleId: string): Promise<string | null> {
    if (!headerFile) return null

    const ext = headerFile.name.split('.').pop()
    const path = `${articleId}/header.${ext}`

    const { error } = await supabase.storage
      .from('article-headers')
      .upload(path, headerFile, { upsert: true })

    if (error) throw new Error(`Error al subir la imagen: ${error.message}`)

    const { data: urlData } = supabase.storage.from('article-headers').getPublicUrl(path)
    return urlData.publicUrl
  }

  async function handleSave(status: 'draft' | 'published') {
    if (!articleId) return
    setSaveStatus('saving')
    setErrorMessage('')

    try {
      const headerImageUrl = await uploadHeader(articleId)

      const result = await updateArticle(articleId, {
        title: title || 'Sin título',
        summary,
        body,
        slug,
        header_image_url: headerImageUrl,
        status,
      })

      setSlug(result.slug)
      setSaveStatus('saved')

      if (status === 'published') {
        setTimeout(() => router.push('/dashboard/articles'), 1000)
      }
    } catch (err) {
      setSaveStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Error al guardar')
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Nuevo artículo</h1>
        {slug && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            Slug: <span className="font-mono">/{slug}</span>
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">
          Título <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Título del artículo"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">
          Resumen <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Breve resumen del artículo (máximo 250 caracteres)"
          maxLength={250}
          rows={3}
          required
        />
        <p className="text-right text-xs text-muted-foreground">
          {summary.length}/250
        </p>
      </div>

      <div className="space-y-2">
        <Label>Imagen de encabezado</Label>
        <Card className="border-dashed">
          <CardContent className="p-4">
            {headerPreview ? (
              <div>
                <img
                  src={headerPreview}
                  alt="Preview"
                  className="h-48 w-full rounded-lg object-cover"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setHeaderFile(null)
                    setHeaderPreview(null)
                  }}
                >
                  Cambiar imagen
                </Button>
              </div>
            ) : (
              <label className="flex h-32 cursor-pointer flex-col items-center justify-center">
                <Image className="mb-2 size-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Haz clic para seleccionar una imagen de encabezado
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleHeaderChange}
                />
              </label>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <Label>Contenido</Label>
        <ArticleEditor
          articleId={articleId ?? undefined}
          content={body}
          onChange={setBody}
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4 lg:left-64">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="min-h-5">
            {saveStatus === 'saving' && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Loader2 className="size-3 animate-spin" />
                Guardando...
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="text-sm text-green-600 dark:text-green-500">
                Guardado
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="text-sm text-destructive">
                {errorMessage || 'Error al guardar'}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleSave('draft')}
              disabled={saveStatus === 'saving' || !articleId}
            >
              <Save className="size-4" />
              Guardar borrador
            </Button>
            <Button
              onClick={() => handleSave('published')}
              disabled={saveStatus === 'saving' || !articleId || !title.trim() || !summary.trim()}
            >
              <Send className="size-4" />
              Publicar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
