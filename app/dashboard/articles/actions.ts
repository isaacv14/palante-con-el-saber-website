'use server'

import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import type { Article } from '@/types/articles'

function generateArticleCode(): string {
  return crypto.randomUUID().slice(0, 8)
}

async function ensureUniqueSlug(
  admin: ReturnType<typeof getSupabaseAdmin>,
  baseSlug: string,
  excludeId?: string,
): Promise<string> {
  let slug = baseSlug || `articulo-${Date.now()}`
  let counter = 1

  while (true) {
    const { data } = await admin
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
  admin: ReturnType<typeof getSupabaseAdmin>,
  userId: string,
): Promise<string> {
  const { data: author } = await admin
    .from('authors')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (!author) throw new Error('Autor no encontrado. Completa tu perfil primero.')
  return author.id
}

export async function uploadArticleHeader(
  articleId: string,
  formData: FormData,
): Promise<string> {
  const file = formData.get('file') as File | null
  if (!file) throw new Error('No se proporcionó ninguna imagen.')

  const server = await createClient()
  const {
    data: { user },
    error: authError,
  } = await server.auth.getUser()
  if (authError || !user) throw new Error('No autorizado.')

  const admin = getSupabaseAdmin()
  const ext = file.name.split('.').pop()
  const path = `${articleId}/header.${ext}`

  const { error: uploadError } = await admin.storage
    .from('article-headers')
    .upload(path, file, { upsert: true })

  if (uploadError) throw new Error(`Error al subir la imagen: ${uploadError.message}`)

  const { data: urlData } = admin.storage.from('article-headers').getPublicUrl(path)
  return urlData.publicUrl
}

export async function uploadArticleBodyImage(
  articleId: string,
  formData: FormData,
): Promise<string> {
  const file = formData.get('file') as File | null
  if (!file) throw new Error('No se proporcionó ninguna imagen.')

  const server = await createClient()
  const {
    data: { user },
    error: authError,
  } = await server.auth.getUser()
  if (authError || !user) throw new Error('No autorizado.')

  const admin = getSupabaseAdmin()
  const timestamp = Date.now()
  const ext = file.name.split('.').pop()
  const path = `${articleId}/body/${timestamp}.${ext}`

  const { error: uploadError } = await admin.storage
    .from('article-body-images')
    .upload(path, file)

  if (uploadError) throw new Error(`Error al subir la imagen: ${uploadError.message}`)

  const { data: urlData } = admin.storage.from('article-body-images').getPublicUrl(path)
  return urlData.publicUrl
}

export async function getArticles() {
  const server = await createClient()

  const {
    data: { user },
    error: authError,
  } = await server.auth.getUser()

  if (authError || !user) {
    throw new Error('No autorizado. Inicia sesión nuevamente.')
  }

  const admin = getSupabaseAdmin()
  const authorId = await getAuthorId(admin, user.id)

  const { data, error } = await admin
    .from('articles')
    .select('id, title, slug, summary, status, published_at, created_at')
    .eq('author_id', authorId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Error al obtener artículos: ${error.message}`)

  return data
}

export async function getArticle(id: string) {
  const server = await createClient()

  const {
    data: { user },
    error: authError,
  } = await server.auth.getUser()

  if (authError || !user) {
    throw new Error('No autorizado. Inicia sesión nuevamente.')
  }

  const admin = getSupabaseAdmin()
  const authorId = await getAuthorId(admin, user.id)

  const { data, error } = await admin
    .from('articles')
    .select('*')
    .eq('id', id)
    .eq('author_id', authorId)
    .single()

  if (error || !data) throw new Error('Artículo no encontrado.')
  return data as Article
}

export async function deleteArticle(id: string) {
  const server = await createClient()

  const {
    data: { user },
    error: authError,
  } = await server.auth.getUser()

  if (authError || !user) {
    throw new Error('No autorizado. Inicia sesión nuevamente.')
  }

  const admin = getSupabaseAdmin()
  const authorId = await getAuthorId(admin, user.id)

  const { data: article, error: articleError } = await admin
    .from('articles')
    .select('id')
    .eq('id', id)
    .eq('author_id', authorId)
    .single()

  if (articleError || !article) {
    throw new Error('Artículo no encontrado o no tienes permiso para eliminarlo.')
  }

  const { error } = await admin.from('articles').delete().eq('id', id)

  if (error) throw new Error(`Error al eliminar el artículo: ${error.message}`)
}

export async function createArticle(payload: {
  title: string
  summary: string
  body?: unknown
  header_image_url?: string | null
  status?: 'draft' | 'published'
  published_at?: string | null
}) {
  const server = await createClient()

  const {
    data: { user },
    error: authError,
  } = await server.auth.getUser()

  if (authError || !user) {
    throw new Error('No autorizado. Inicia sesión nuevamente.')
  }

  const admin = getSupabaseAdmin()

  const { data: author } = await admin
    .from('authors')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!author) {
    throw new Error('Autor no encontrado. Completa tu perfil primero.')
  }

  const code = generateArticleCode()
  const uniqueSlug = await ensureUniqueSlug(admin, code)

  const { data, error } = await admin
    .from('articles')
    .insert({
      author_id: author.id,
      title: payload.title,
      summary: payload.summary,
      body: payload.body ?? {},
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
    status?: 'draft' | 'published'
    published_at?: string | null
  },
) {
  const server = await createClient()

  const {
    data: { user },
    error: authError,
  } = await server.auth.getUser()

  if (authError || !user) {
    throw new Error('No autorizado. Inicia sesión nuevamente.')
  }

  const admin = getSupabaseAdmin()

  const { data: article, error: articleError } = await admin
    .from('articles')
    .select('author_id')
    .eq('id', id)
    .single()

  if (articleError || !article) {
    throw new Error('Artículo no encontrado.')
  }

  const { data: author } = await admin
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

  if (payload.status === 'published') {
    const { data: current } = await admin
      .from('articles')
      .select('published_at')
      .eq('id', id)
      .single()

    if (!current?.published_at) {
      updateData.published_at = new Date().toISOString()
    }
  }

  const { data, error } = await admin
    .from('articles')
    .update(updateData)
    .eq('id', id)
    .select('id, slug')
    .single()

  if (error) throw new Error(`Error al guardar el artículo: ${error.message}`)

  return data
}
