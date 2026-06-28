'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { getArticles, deleteArticle } from '@/app/dashboard/articles/actions'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import { Plus, Edit, Trash2, ExternalLink, FileText, AlertTriangle } from 'lucide-react'
import type { Article } from '@/types/articles'

type ArticlesList = Pick<Article, 'id' | 'title' | 'slug' | 'summary' | 'status' | 'published_at' | 'created_at'>[]

export default function DashboardPage() {
  const router = useRouter()
  const [articles, setArticles] = useState<ArticlesList>([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchArticles = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getArticles()
      setArticles(data || [])
    } catch {
      setArticles([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteArticle(deleteTarget)
      setArticles((prev) => prev.filter((a) => a.id !== deleteTarget))
      setDeleteTarget(null)
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Administra tus artículos</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/articles/new">
            <Plus className="size-4" />
            Nuevo artículo
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <FileText className="mb-4 size-12 text-muted-foreground/50" />
          <h3 className="mb-1 text-lg font-medium text-foreground">No hay artículos</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Crea tu primer artículo para empezar a publicar.
          </p>
          <Button asChild>
            <Link href="/dashboard/articles/new">
              <Plus className="size-4" />
              Crear tu primer artículo
            </Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha de publicación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="max-w-xs">
                    <p className="truncate font-medium">{article.title || 'Sin título'}</p>
                  </TableCell>
                  <TableCell>
                    {article.status === 'published' ? (
                      <Badge variant="default" className="bg-green-600 hover:bg-green-600/80">
                        Publicado
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Borrador</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {article.published_at
                      ? format(new Date(article.published_at), 'd MMM yyyy', { locale: es })
                      : '—'}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" asChild>
                        <Link href={`/dashboard/articles/${article.id}/edit`}>
                          <Edit className="size-4" />
                          <span className="sr-only">Editar</span>
                        </Link>
                      </Button>
                      {article.status === 'published' && article.slug && (
                        <Button variant="ghost" size="icon-sm" asChild>
                          <a href={`/informativo/${article.slug}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="size-4" />
                            <span className="sr-only">Ver en sitio</span>
                          </a>
                        </Button>
                      )}
                      <Dialog
                        open={deleteTarget === article.id}
                        onOpenChange={(open) => {
                          if (!open) setDeleteTarget(null)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteTarget(article.id)}
                          >
                            <Trash2 className="size-4" />
                            <span className="sr-only">Eliminar</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <AlertTriangle className="size-5 text-destructive" />
                              Eliminar artículo
                            </DialogTitle>
                            <DialogDescription>
                              ¿Estás seguro de que deseas eliminar este artículo? Esta acción no se puede deshacer.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                              Cancelar
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleDelete}
                              disabled={deleting}
                            >
                              {deleting ? 'Eliminando...' : 'Eliminar'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
