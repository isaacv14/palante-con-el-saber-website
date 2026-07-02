import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { FileText, User } from 'lucide-react'
import { getCloudinaryUrl, isCloudinaryPublicId } from '@/lib/cloudinary'

type ArticleCardProps = {
  title: string
  summary: string
  headerImageUrl: string | null
  headerImagePublicId: string | null
  slug: string
  publishedAt: string
  authorName: string
  authorPhotoUrl: string | null
}

export default function ArticleCard({
  title,
  summary,
  headerImageUrl,
  headerImagePublicId,
  slug,
  publishedAt,
  authorName,
  authorPhotoUrl,
}: ArticleCardProps) {
  const dateFormatted = format(new Date(publishedAt), "d 'de' MMMM 'de' yyyy", { locale: es })

  const headerSrc = headerImagePublicId
    ? getCloudinaryUrl(headerImagePublicId, { width: 600 })
    : headerImageUrl

  return (
    <Link
      href={`/informativo/${slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:shadow-md hover:border-primary/20"
    >
      <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
        {headerSrc ? (
          <img
            src={headerSrc}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FileText className="size-10 text-muted-foreground/40" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h2 className="text-lg font-bold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h2>

        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {summary}
        </p>

        <div className="mt-auto flex items-center gap-3 pt-2">
          <div className="size-8 shrink-0 overflow-hidden rounded-full bg-muted">
            {authorPhotoUrl ? (
              <img
                src={authorPhotoUrl}
                alt={authorName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <User className="size-4 text-muted-foreground/60" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {authorName}
            </p>
            <p className="text-xs text-muted-foreground">
              {dateFormatted}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
