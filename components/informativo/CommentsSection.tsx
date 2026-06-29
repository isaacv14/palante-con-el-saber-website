'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

type Comment = {
  id: string
  article_id: string
  author_name: string
  content: string
  status: string
  created_at: string
}

type FormStatus =
  | { type: 'idle' }
  | { type: 'submitting' }
  | { type: 'success'; message: string }
  | { type: 'error'; message: string }

const LS_KEY = 'palante_commenter_name'

export default function CommentsSection({ articleId }: { articleId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [savedName, setSavedName] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<FormStatus>({ type: 'idle' })

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY)
    if (saved) {
      setName(saved)
      setSavedName(saved)
    }
  }, [])

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(
          `/api/comments?article_id=${encodeURIComponent(articleId)}`,
        )
        if (!res.ok) return
        const data: Comment[] = await res.json()
        setComments(data)
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    fetchComments()
  }, [articleId])

  const handleClearName = useCallback(() => {
    localStorage.removeItem(LS_KEY)
    setName('')
    setSavedName(null)
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const trimmedName = name.trim()
      const trimmedContent = content.trim()

      if (!trimmedName || !trimmedContent) return

      setStatus({ type: 'submitting' })

      try {
        const res = await fetch('/api/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            article_id: articleId,
            author_name: trimmedName,
            content: trimmedContent,
          }),
        })

        const body = await res.json()

        if (res.ok) {
          localStorage.setItem(LS_KEY, trimmedName)
          setName(trimmedName)
          setSavedName(trimmedName)
          setContent('')
          const approved = body.status === 'approved'
          setStatus({
            type: 'success',
            message: approved
              ? '¡Comentario publicado exitosamente!'
              : '¡Tu comentario fue enviado! Estará visible una vez aprobado.',
          })
        } else if (res.status === 429) {
          setStatus({ type: 'error', message: body.error })
        } else if (res.status === 400) {
          setStatus({ type: 'error', message: body.error })
        } else {
          setStatus({ type: 'error', message: 'Hubo un error. Intenta de nuevo.' })
        }
      } catch {
        setStatus({ type: 'error', message: 'Hubo un error. Intenta de nuevo.' })
      }
    },
    [articleId, name, content],
  )

  return (
    <section>
      <hr className="mb-8 border-border" />

      <h2 className="mb-6 text-2xl font-bold text-foreground">Comentarios</h2>

      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner className="size-6 text-muted-foreground" />
        </div>
      ) : comments.length === 0 ? (
        <p className="mb-8 text-muted-foreground">Sé el primero en comentar.</p>
      ) : (
        <div className="mb-8 space-y-4">
          {comments.map((c) => (
            <div
              key={c.id}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  {c.author_name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(c.created_at), "d 'de' MMMM, yyyy", {
                    locale: es,
                  })}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-foreground">
                {c.content}
              </p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          {savedName ? (
            <p className="mb-2 text-sm text-muted-foreground">
              Comentando como{' '}
              <span className="font-semibold text-foreground">{name}</span>.
              <button
                type="button"
                onClick={handleClearName}
                className="ml-1 underline hover:text-foreground"
              >
                ¿No eres tú?
              </button>
            </p>
          ) : (
            <>
              <label
                htmlFor="comment-name"
                className="mb-1 block text-sm font-medium text-foreground"
              >
                Nombre
              </label>
              <Input
                id="comment-name"
                type="text"
                placeholder="Tu nombre"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
              />
            </>
          )}
        </div>

        <div>
          <label
            htmlFor="comment-content"
            className="mb-1 block text-sm font-medium text-foreground"
          >
            Comentario
          </label>
          <Textarea
            id="comment-content"
            placeholder="Escribe tu comentario..."
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={1000}
            rows={4}
          />
          <p className="mt-1 text-right text-xs text-muted-foreground">
            {content.length}/1000
          </p>
        </div>

        {status.type === 'error' && (
          <p className="text-sm text-destructive">{status.message}</p>
        )}

        {status.type === 'success' && (
          <p className="text-sm text-green-600 dark:text-green-400">
            {status.message}
          </p>
        )}

        <Button type="submit" disabled={status.type === 'submitting'}>
          {status.type === 'submitting' ? (
            <>
              <Spinner className="size-4" /> Enviando...
            </>
          ) : (
            'Publicar comentario'
          )}
        </Button>
      </form>
    </section>
  )
}
