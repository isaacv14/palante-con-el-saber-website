'use server'

import { createClient } from '@/lib/supabase/server'

async function verifyCommentOwnership(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  commentId: string,
) {
  const { data: author } = await supabase
    .from('authors')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (!author) throw new Error('Autor no encontrado.')

  const { data: comment } = await supabase
    .from('comments')
    .select('article_id')
    .eq('id', commentId)
    .single()

  if (!comment) throw new Error('Comentario no encontrado.')

  const { data: article } = await supabase
    .from('articles')
    .select('id')
    .eq('id', comment.article_id)
    .eq('author_id', author.id)
    .single()

  if (!article) {
    throw new Error('No tienes permiso para moderar este comentario.')
  }
}

export type CommentWithArticle = {
  id: string
  article_id: string
  author_name: string
  content: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  article_title: string
  article_slug: string
}

export async function getComments(filter?: 'pending' | 'approved' | 'rejected') {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('No autorizado. Inicia sesión nuevamente.')
  }

  const { data: author } = await supabase
    .from('authors')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!author) throw new Error('Autor no encontrado.')

  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, slug')
    .eq('author_id', author.id)

  if (!articles || articles.length === 0) return []

  const articleIds = articles.map((a) => a.id)
  const articleMap = new Map(articles.map((a) => [a.id, { title: a.title, slug: a.slug }]))

  let query = supabase
    .from('comments')
    .select('id, article_id, author_name, content, status, created_at')
    .in('article_id', articleIds)
    .order('created_at', { ascending: false })

  if (filter) {
    query = query.eq('status', filter)
  }

  const { data, error } = await query

  if (error) throw new Error(`Error al obtener comentarios: ${error.message}`)

  return (data || []).map((c) => {
    const article = articleMap.get(c.article_id)
    return {
      id: c.id,
      article_id: c.article_id,
      author_name: c.author_name,
      content: c.content,
      status: c.status as 'pending' | 'approved' | 'rejected',
      created_at: c.created_at,
      article_title: article?.title || 'Sin título',
      article_slug: article?.slug || '',
    }
  }) as CommentWithArticle[]
}

export async function getPendingCommentsCount() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) return 0

  const { data: author } = await supabase
    .from('authors')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!author) return 0

  const { data: articles } = await supabase
    .from('articles')
    .select('id')
    .eq('author_id', author.id)

  if (!articles || articles.length === 0) return 0

  const articleIds = articles.map((a) => a.id)

  const { count, error } = await supabase
    .from('comments')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending')
    .in('article_id', articleIds)

  if (error) return 0
  return count ?? 0
}

export async function approveComment(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) throw new Error('No autorizado.')

  await verifyCommentOwnership(supabase, user.id, id)

  const { error } = await supabase
    .from('comments')
    .update({ status: 'approved' })
    .eq('id', id)

  if (error) throw new Error(`Error al aprobar comentario: ${error.message}`)
}

export async function rejectComment(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) throw new Error('No autorizado.')

  await verifyCommentOwnership(supabase, user.id, id)

  const { error } = await supabase
    .from('comments')
    .update({ status: 'rejected' })
    .eq('id', id)

  if (error) throw new Error(`Error al rechazar comentario: ${error.message}`)
}
