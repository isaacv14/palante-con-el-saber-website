'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ArticleEditor from '@/components/editor/ArticleEditor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Loader2, Image, Save, Send, ArrowLeft } from 'lucide-react'
import { getArticle, updateArticle, uploadArticleHeader } from '../../actions'
import Link from 'next/link'
import type { Article } from '@/types/articles'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export default function EditArticlePage() {
  const router = useRouter()
  const params = useParams()
  const articleId = params.id as string

  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [body, setBody] = useState<unknown>(null)
  const [headerFile, setHeaderFile] = useState<File | null>(null)
  const [headerPreview, setHeaderPreview] = useState<string | null>(null)
  const [currentHeaderUrl, setCurrentHeaderUrl] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const data = await getArticle(articleId)
        setArticle(data)
        setTitle(data.title)
        setSummary(data.summary)
        setBody(data.body)
        setCurrentHeaderUrl(data.header_image_url)
      } catch (err) {
        console.error('Error al cargar artículo:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [articleId])

  function handleHeaderChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setHeaderFile(file)
    setHeaderPreview(URL.createObjectURL(file))
  }

  async function uploadHeader(): Promise<string | null> {
    if (!headerFile) return currentHeaderUrl

    const formData = new FormData()
    formData.set('file', headerFile)

    try {
      return await uploadArticleHeader(articleId, formData)
    } catch {
      return currentHeaderUrl
    }
  }

  async function handleSave(status: 'draft' | 'published') {
    setSaveStatus('saving')
    setErrorMessage('')

    try {
      const headerImageUrl = await uploadHeader()

      await updateArticle(articleId, {
        title: title || 'Sin título',
        summary,
        body,
        header_image_url: headerImageUrl,
        status,
      })

      setSaveStatus('saved')

      if (status === 'published') {
        setTimeout(() => router.push('/dashboard'), 1000)
      }
    } catch (err) {
      setSaveStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Error al guardar')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Artículo no encontrado</h1>
        <p className="text-muted-foreground">El artículo que buscas no existe o no tienes permiso para editarlo.</p>
        <Button asChild variant="outline">
          <Link href="/dashboard">
            <ArrowLeft className="size-4" />
            Volver al dashboard
          </Link>
        </Button>
      </div>
    )
  }

  const headerImageSrc = headerPreview || currentHeaderUrl

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-24">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2">
          <Link href="/dashboard">
            <ArrowLeft className="size-4" />
            Volver
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Editar artículo</h1>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">
          Título <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
            {headerImageSrc ? (
              <div>
                <img
                  src={headerImageSrc}
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
                    setCurrentHeaderUrl(null)
                  }}
                >
                  {currentHeaderUrl && !headerPreview ? 'Eliminar imagen' : 'Cambiar imagen'}
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
          articleId={articleId}
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
              disabled={saveStatus === 'saving'}
            >
              <Save className="size-4" />
              Guardar borrador
            </Button>
            <Button
              onClick={() => handleSave('published')}
              disabled={saveStatus === 'saving' || !title.trim() || !summary.trim()}
            >
              <Send className="size-4" />
              {article.status === 'published' ? 'Actualizar' : 'Publicar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
