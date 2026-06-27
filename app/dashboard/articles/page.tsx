import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText } from 'lucide-react'

export default function ArticlesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mis artículos</h1>
        <p className="text-muted-foreground">Aquí aparecerán tus artículos.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <FileText className="size-5 text-muted-foreground" />
          <CardTitle className="text-lg">Próximamente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            El editor de artículos estará disponible pronto.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
