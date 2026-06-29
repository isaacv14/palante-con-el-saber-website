'use server'

import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import type { Author } from '@/types/articles'

export type ProfileFormData = {
  full_name: string
  instagram: string | null
  linkedin: string | null
  email: string | null
  bio: string | null
  photo_url: string | null
}

export type ActionResult = {
  success: boolean
  message: string
  author?: Author
  photo_url?: string | null
}

export async function uploadProfilePhoto(userId: string, formData: FormData): Promise<ActionResult> {
  const file = formData.get('file') as File | null
  if (!file) return { success: false, message: 'No se proporcionó ninguna imagen.' }

  const supabase = getSupabaseAdmin()
  const path = `${userId}/profile.jpg`

  const { error: uploadError } = await supabase.storage
    .from('author-photos')
    .upload(path, file, { upsert: true })

  if (uploadError) return { success: false, message: uploadError.message }

  const { data: urlData } = supabase.storage.from('author-photos').getPublicUrl(path)
  const photoUrl = `${urlData.publicUrl}?t=${Date.now()}`

  return { success: true, message: 'Foto subida exitosamente.', photo_url: photoUrl }
}

export async function saveProfile(data: ProfileFormData): Promise<ActionResult> {
  const server = await createClient()

  const {
    data: { user },
    error: authError,
  } = await server.auth.getUser()

  if (authError || !user) {
    return { success: false, message: 'No autorizado. Inicia sesión nuevamente.' }
  }

  const admin = getSupabaseAdmin()
  const payload = {
    user_id: user.id,
    full_name: data.full_name,
    photo_url: data.photo_url,
    instagram: data.instagram || null,
    linkedin: data.linkedin || null,
    email: data.email || null,
    bio: data.bio || null,
    updated_at: new Date().toISOString(),
  }

  const { data: existing } = await admin
    .from('authors')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  let result
  if (existing) {
    result = await admin
      .from('authors')
      .update(payload)
      .eq('id', existing.id)
      .select('*')
      .single()
  } else {
    result = await admin
      .from('authors')
      .insert({ ...payload, created_at: new Date().toISOString() })
      .select('*')
      .single()
  }

  if (result.error) {
    return { success: false, message: result.error.message }
  }

  return { success: true, message: 'Perfil guardado exitosamente.', author: result.data }
}
