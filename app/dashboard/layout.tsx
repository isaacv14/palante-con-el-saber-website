'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  LayoutDashboard,
  FileText,
  User,
  MessageCircle,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'

const navItems = [
  { href: '/dashboard', label: 'Inicio', icon: LayoutDashboard },
  { href: '/dashboard/articles', label: 'Mis artículos', icon: FileText },
  { href: '/dashboard/comments', label: 'Comentarios', icon: MessageCircle },
  { href: '/dashboard/profile', label: 'Perfil', icon: User },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.push('/dashboard/login')
        return
      }
      setUser(user)

      try {
        const { getPendingCommentsCount } = await import('@/app/dashboard/comments/actions')
        const count = await getPendingCommentsCount()
        setPendingCount(count)
      } catch {
        // ignore
      }
    })
  }, [router])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/dashboard/login')
    router.refresh()
  }

  if (!user) return null

  const displayName = user.email ?? 'Autor'
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <div className="flex min-h-dvh bg-muted/30">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-3 border-b px-6">
          <img src="/favicon.svg" alt="Logo" className="h-8 w-auto" />
          <span className="text-sm font-semibold leading-tight text-foreground">
            Pa'lante
            <br />
            Con El Saber
          </span>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            const showBadge = item.href === '/dashboard/comments' && pendingCount > 0
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon className="size-4" />
                <span className="flex-1">{item.label}</span>
                {showBadge && (
                  <Badge className="size-5 rounded-full p-0 text-[10px] font-bold leading-none flex items-center justify-center">
                    {pendingCount}
                  </Badge>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="border-t p-4">
          <div className="mb-3 flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {displayName}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-muted-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="size-4" />
            Cerrar sesión
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-muted-foreground"
            aria-label="Abrir menú"
          >
            <Menu className="size-6" />
          </button>
          <img src="/favicon.svg" alt="Logo" className="h-7 w-auto" />
          <span className="text-sm font-semibold">Pa'lante Con El Saber</span>
        </header>

        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
