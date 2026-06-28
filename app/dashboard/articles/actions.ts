'use server'

import { createClient } from '@/lib/supabase/server'
import type { Article } from '@/types/articles'

function sanitizeSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

async function ensureUniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  baseSlug: string,
  excludeId?: string,
): Promise<string> {
  let slug = baseSlug || `articulo-${Date.now()}`
  let counter = 1

  while (true) {
    const { data } = await supabase
      .from('articles')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (!data || (excludeId && data.id === excludeId)) return slug
    counter++
    slug = `${baseSlug}-${counter}`
  }
}

async function getAuthorId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<string> {
  const { data: author } = await supabase
    .from('authors')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (!author) throw new Error('Autor no encontrado. Completa tu perfil primero.')
  return author.id
}

export async function getArticles() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('No autorizado. Inicia sesión nuevamente.')
  }

  const authorId = await getAuthorId(supabase, user.id)

  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, summary, status, published_at, created_at')
    .eq('author_id', authorId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Error al obtener artículos: ${error.message}`)

  return data
}

export async function getArticle(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('No autorizado. Inicia sesión nuevamente.')
  }

  const authorId = await getAuthorId(supabase, user.id)

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .eq('author_id', authorId)
    .single()

  if (error || !data) throw new Error('Artículo no encontrado.')
  return data as Article
}

export async function deleteArticle(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('No autorizado. Inicia sesión nuevamente.')
  }

  const authorId = await getAuthorId(supabase, user.id)

  const { data: article, error: articleError } = await supabase
    .from('articles')
    .select('id')
    .eq('id', id)
    .eq('author_id', authorId)
    .single()

  if (articleError || !article) {
    throw new Error('Artículo no encontrado o no tienes permiso para eliminarlo.')
  }

  const { error } = await supabase.from('articles').delete().eq('id', id)

  if (error) throw new Error(`Error al eliminar el artículo: ${error.message}`)
}

export async function createArticle(payload: {
  title: string
  summary: string
  slug?: string
  body?: unknown
  header_image_url?: string | null
  status?: 'draft' | 'published'
  published_at?: string | null
}) {
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

  if (!author) {
    throw new Error('Autor no encontrado. Completa tu perfil primero.')
  }

  const slug = payload.slug || sanitizeSlug(payload.title) || `temp-${Date.now()}`
  const uniqueSlug = await ensureUniqueSlug(supabase, slug)

  const { data, error } = await supabase
    .from('articles')
    .insert({
      author_id: author.id,
      title: payload.title,
      summary: payload.summary,
      body: payload.body ?? null,
      header_image_url: payload.header_image_url ?? null,
      slug: uniqueSlug,
      status: payload.status ?? 'draft',
      published_at: payload.published_at ?? null,
      updated_at: new Date().toISOString(),
    })
    .select('id, slug')
    .single()

  if (error) throw new Error(`Error al crear el artículo: ${error.message}`)

  return data
}

export async function updateArticle(
  id: string,
  payload: {
    title?: string
    summary?: string
    body?: unknown
    header_image_url?: string | null
    slug?: string
    status?: 'draft' | 'published'
    published_at?: string | null
  },
) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('No autorizado. Inicia sesión nuevamente.')
  }

  const { data: article, error: articleError } = await supabase
    .from('articles')
    .select('author_id')
    .eq('id', id)
    .single()

  if (articleError || !article) {
    throw new Error('Artículo no encontrado.')
  }

  const { data: author } = await supabase
    .from('authors')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!author || article.author_id !== author.id) {
    throw new Error('No tienes permiso para modificar este artículo.')
  }

  const updateData: Record<string, unknown> = {}

  if (payload.title !== undefined) updateData.title = payload.title
  if (payload.summary !== undefined) updateData.summary = payload.summary
  if (payload.body !== undefined) updateData.body = payload.body
  if (payload.header_image_url !== undefined) updateData.header_image_url = payload.header_image_url
  if (payload.status !== undefined) updateData.status = payload.status

  updateData.updated_at = new Date().toISOString()

  if (payload.slug !== undefined) {
    updateData.slug = await ensureUniqueSlug(supabase, payload.slug, id)
  }

  if (payload.status === 'published') {
    const { data: current } = await supabase
      .from('articles')
      .select('published_at')
      .eq('id', id)
      .single()

    if (!current?.published_at) {
      updateData.published_at = new Date().toISOString()
    }
  }

  const { data, error } = await supabase
    .from('articles')
    .update(updateData)
    .eq('id', id)
    .select('id, slug')
    .single()

  if (error) throw new Error(`Error al guardar el artículo: ${error.message}`)

  return data
}
