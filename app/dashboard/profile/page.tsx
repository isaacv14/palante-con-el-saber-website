'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Spinner } from '@/components/ui/spinner'
import { Camera, Save } from 'lucide-react'
import { saveProfile, uploadProfilePhoto, type ProfileFormData } from './actions'

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [userId, setUserId] = useState<string | null>(null)
  const [fullName, setFullName] = useState('')
  const [instagram, setInstagram] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [publicEmail, setPublicEmail] = useState('')
  const [bio, setBio] = useState('')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    setUserId(user.id)

    const { data: author } = await supabase
      .from('authors')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (author) {
      setFullName(author.full_name ?? '')
      setInstagram(author.instagram ?? '')
      setLinkedin(author.linkedin ?? '')
      setPublicEmail(author.email ?? '')
      setBio(author.bio ?? '')
      setPhotoUrl(author.photo_url)
    }

    setLoading(false)
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setPhotoFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => {
      setPhotoPreview(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  async function uploadPhoto(): Promise<string | null> {
    if (!photoFile || !userId) return photoUrl

    setUploading(true)

    const formData = new FormData()
    formData.set('file', photoFile)

    const result = await uploadProfilePhoto(userId, formData)

    if (!result.success) {
      setMessage({ type: 'error', text: 'Error al subir la foto: ' + result.message })
      setUploading(false)
      return null
    }

    setUploading(false)
    return result.photo_url ?? null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const finalPhotoUrl = photoFile ? await uploadPhoto() : photoUrl

    if (photoFile && !finalPhotoUrl) {
      setSaving(false)
      return
    }

    const data: ProfileFormData = {
      full_name: fullName,
      instagram: instagram || null,
      linkedin: linkedin || null,
      email: publicEmail || null,
      bio: bio || null,
      photo_url: finalPhotoUrl,
    }

    const result = await saveProfile(data)

    if (result.success) {
      setPhotoUrl(finalPhotoUrl)
      setPhotoFile(null)
      setPhotoPreview(null)
      setMessage({ type: 'success', text: result.message })
    } else {
      setMessage({ type: 'error', text: result.message })
    }

    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    )
  }

  const displayPhoto = photoPreview ?? photoUrl

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Perfil</h1>
        <p className="text-muted-foreground">Actualiza tu información personal</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Foto de perfil</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="relative">
              <Avatar className="size-24">
                {displayPhoto ? (
                  <AvatarImage src={displayPhoto} alt="Foto de perfil" />
                ) : null}
                <AvatarFallback className="bg-muted text-2xl text-muted-foreground">
                  {fullName.charAt(0)?.toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/60">
                  <Spinner className="size-6" />
                </div>
              )}
            </div>
            <div className="text-center sm:text-left">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="size-4" />
                {photoUrl ? 'Cambiar foto' : 'Subir foto'}
              </Button>
              <p className="mt-1 text-xs text-muted-foreground">
                PNG, JPG o WEBP. Se redimensionará automáticamente.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Información personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre completo</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Tu nombre completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@usuario"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/usuario"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publicEmail">Email de contacto público</Label>
              <Input
                id="publicEmail"
                type="email"
                value={publicEmail}
                onChange={(e) => setPublicEmail(e.target.value)}
                placeholder="autor@ejemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">
                Biografía{' '}
                <span className="text-muted-foreground font-normal">
                  ({bio.length}/300 caracteres)
                </span>
              </Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 300))}
                placeholder="Breve descripción sobre ti..."
                maxLength={300}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {message && (
          <div
            className={`mt-4 rounded-md border px-4 py-3 text-sm ${
              message.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-destructive/30 bg-destructive/10 text-destructive'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={saving || uploading}>
            {saving || uploading ? (
              <Spinner className="size-4" />
            ) : (
              <Save className="size-4" />
            )}
            {saving || uploading ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </div>
  )
}
