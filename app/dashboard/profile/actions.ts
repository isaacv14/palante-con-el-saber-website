'use server'

import { createClient } from '@/lib/supabase/server'
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
}

export async function saveProfile(data: ProfileFormData): Promise<ActionResult> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, message: 'No autorizado. Inicia sesión nuevamente.' }
  }

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

  const { data: existing } = await supabase
    .from('authors')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  let result
  if (existing) {
    result = await supabase
      .from('authors')
      .update(payload)
      .eq('id', existing.id)
      .select('*')
      .single()
  } else {
    result = await supabase
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
