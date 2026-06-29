import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { containsProfanity } from '@/lib/moderation'

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX = 3

const rateMap = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = rateMap.get(ip) ?? []
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  rateMap.set(ip, recent)
  return recent.length >= RATE_LIMIT_MAX
}

function recordRequest(ip: string): void {
  const now = Date.now()
  const timestamps = rateMap.get(ip) ?? []
  timestamps.push(now)
  rateMap.set(ip, timestamps)
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const articleId = searchParams.get('article_id')

  if (!articleId) {
    return NextResponse.json(
      { error: 'article_id es obligatorio.' },
      { status: 400 },
    )
  }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('comments')
    .select('id, article_id, author_name, content, status, created_at')
    .eq('article_id', articleId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Hubo un error al cargar los comentarios.' },
      { status: 500 },
    )
  }

  return NextResponse.json(data ?? [])
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      '127.0.0.1'

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Enviaste demasiados comentarios seguidos. Espera unos minutos.' },
        { status: 429 },
      )
    }

    let body: { article_id?: string; author_name?: string; content?: string }

    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Cuerpo de solicitud inválido.' },
        { status: 400 },
      )
    }

    const { article_id, author_name, content } = body

    if (!article_id || !author_name || !content) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios.' },
        { status: 400 },
      )
    }

    const trimmedName = author_name.trim()
    const trimmedContent = content.trim()

    if (!trimmedName || !trimmedContent) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios.' },
        { status: 400 },
      )
    }

    if (trimmedName.length > 100) {
      return NextResponse.json(
        { error: 'El nombre no puede tener más de 100 caracteres.' },
        { status: 400 },
      )
    }

    if (trimmedContent.length > 1000) {
      return NextResponse.json(
        { error: 'El comentario no puede tener más de 1000 caracteres.' },
        { status: 400 },
      )
    }

    const isProfane = containsProfanity(trimmedContent)
    const status = isProfane ? 'pending' : 'approved'

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('comments')
      .insert({
        article_id,
        author_name: trimmedName,
        content: trimmedContent,
        status,
      })
      .select('id, article_id, author_name, content, status, created_at')
      .single()

    if (error) {
      console.error('Error inserting comment:', error)
      return NextResponse.json(
        { error: 'Hubo un error. Intenta de nuevo.' },
        { status: 500 },
      )
    }

    recordRequest(ip)

    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Hubo un error. Intenta de nuevo.' },
      { status: 500 },
    )
  }
}
