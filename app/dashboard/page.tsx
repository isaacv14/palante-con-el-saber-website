import { LayoutDashboard } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-24">
      <LayoutDashboard className="mb-4 size-16 text-muted-foreground/30" />
      <h1 className="mb-2 text-2xl font-bold text-foreground">Dashboard</h1>
      <p className="text-lg text-muted-foreground">Próximamente</p>
    </div>
  )
}
