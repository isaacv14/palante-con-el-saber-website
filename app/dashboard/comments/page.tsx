'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { getComments, approveComment, rejectComment } from './actions'
import type { CommentWithArticle } from './actions'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Spinner } from '@/components/ui/spinner'
import { Check, X, MessageCircle, ExternalLink } from 'lucide-react'

type FilterValue = 'pending' | 'approved' | 'rejected'

export default function CommentsPage() {
  const [comments, setComments] = useState<CommentWithArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<FilterValue>('pending')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchComments = useCallback(async (filter: FilterValue) => {
    setLoading(true)
    try {
      const data = await getComments(filter)
      setComments(data || [])
    } catch {
      setComments([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchComments(activeTab)
  }, [activeTab, fetchComments])

  async function handleApprove(id: string) {
    setActionLoading(id)
    try {
      await approveComment(id)
      setComments((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(null)
    }
  }

  async function handleReject(id: string) {
    setActionLoading(id)
    try {
      await rejectComment(id)
      setComments((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(null)
    }
  }

  const groupedByArticle = comments.reduce<Record<string, { title: string; slug: string; comments: CommentWithArticle[] }>>(
    (acc, comment) => {
      const key = comment.article_id
      if (!acc[key]) {
        acc[key] = { title: comment.article_title, slug: comment.article_slug, comments: [] }
      }
      acc[key].comments.push(comment)
      return acc
    },
    {},
  )

  const articleGroups = Object.entries(groupedByArticle)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Comentarios</h1>
        <p className="text-muted-foreground">Modera los comentarios de tus artículos</p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FilterValue)}>
        <TabsList>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="approved">Aprobados</TabsTrigger>
          <TabsTrigger value="rejected">Rechazados</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
              <MessageCircle className="mb-4 size-12 text-muted-foreground/50" />
              <h3 className="mb-1 text-lg font-medium text-foreground">
                {activeTab === 'pending'
                  ? 'No hay comentarios pendientes'
                  : activeTab === 'approved'
                    ? 'No hay comentarios aprobados'
                    : 'No hay comentarios rechazados'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {activeTab === 'pending'
                  ? 'Los comentarios nuevos aparecerán aquí.'
                  : 'Los comentarios moderados aparecerán aquí.'}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {articleGroups.map(([articleId, group]) => (
                <section key={articleId}>
                  <div className="mb-3 flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-foreground">
                      {group.title}
                    </h2>
                    {group.slug && (
                      <a
                        href={`/informativo/${group.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                    )}
                  </div>
                  <div className="space-y-3">
                    {group.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="rounded-lg border bg-card p-4"
                      >
                        <div className="mb-2 flex items-start justify-between gap-4">
                          <div>
                            <span className="text-sm font-medium text-foreground">
                              {comment.author_name}
                            </span>
                            <span className="mx-2 text-xs text-muted-foreground">·</span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(comment.created_at), 'd MMM yyyy, HH:mm', { locale: es })}
                            </span>
                          </div>
                          {comment.status === 'approved' && (
                            <Badge variant="default" className="bg-green-600 text-xs">
                              Aprobado
                            </Badge>
                          )}
                          {comment.status === 'rejected' && (
                            <Badge variant="destructive" className="text-xs">
                              Rechazado
                            </Badge>
                          )}
                        </div>
                        <p className="mb-3 text-sm text-muted-foreground">
                          {comment.content}
                        </p>
                        {comment.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              className="bg-green-600 hover:bg-green-600/80"
                              onClick={() => handleApprove(comment.id)}
                              disabled={actionLoading === comment.id}
                            >
                              <Check className="size-3.5" />
                              Aprobar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive border-destructive hover:bg-destructive/10"
                              onClick={() => handleReject(comment.id)}
                              disabled={actionLoading === comment.id}
                            >
                              <X className="size-3.5" />
                              Rechazar
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
