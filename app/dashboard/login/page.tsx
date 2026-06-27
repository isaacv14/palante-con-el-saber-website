'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message === 'Invalid login credentials'
        ? 'Credenciales incorrectas. Verifica tu email y contraseña.'
        : 'Ocurrió un error al iniciar sesión. Intenta de nuevo.',
      )
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <img src="/favicon.svg" alt="Pa'lante Con El Saber" className="mx-auto h-16 w-auto" />
          </div>
          <CardTitle className="text-xl">Iniciar sesión</CardTitle>
          <CardDescription>Ingresa tus credenciales para acceder al dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive font-medium">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Spinner /> : null}
              {loading ? 'Iniciando sesión…' : 'Iniciar sesión'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
