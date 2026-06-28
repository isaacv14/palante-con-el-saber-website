import { createClient } from '@/lib/supabase/server'
import ArticleCard from '@/components/informativo/ArticleCard'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { ChevronLeft, ChevronRight, Newspaper } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Informativo | Pa'lante Con El Saber",
  description:
    'Artículos y publicaciones del equipo de Pa\'lante Con El Saber sobre orientación vocacional, educación y más.',
  openGraph: {
    title: "Informativo | Pa'lante Con El Saber",
    description:
      'Artículos y publicaciones del equipo de Pa\'lante Con El Saber sobre orientación vocacional, educación y más.',
    url: 'https://palanteconelsaber.site/informativo',
    siteName: "Pa'lante Con El Saber",
    images: [{ url: 'https://palanteconelsaber.site/logo-white.png' }],
    locale: 'es_PA',
    type: 'website',
  },
}

const PER_PAGE = 9

type PageProps = {
  searchParams: Promise<{ page?: string }>
}

export default async function InformativoPage({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams
  const currentPage = Math.max(1, Number(pageParam) || 1)
  const from = (currentPage - 1) * PER_PAGE
  const to = from + PER_PAGE - 1

  const supabase = await createClient()

  const [{ data: articles }, { count }] = await Promise.all([
    supabase
      .from('articles')
      .select(
        'id, title, summary, header_image_url, slug, published_at, author:author_id(full_name, photo_url)',
      )
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .range(from, to),
    supabase
      .from('articles')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'published')
      .not('published_at', 'is', null),
  ])

  const totalPages = Math.ceil((count ?? 0) / PER_PAGE)
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">
            Informativo
          </h1>
          <p className="mt-2 text-muted-foreground">
            Artículos y publicaciones del equipo
          </p>
        </div>

        {!articles || articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20">
            <Newspaper className="mb-4 size-12 text-muted-foreground/50" />
            <h2 className="mb-1 text-lg font-medium text-foreground">
              Próximamente publicaremos artículos
            </h2>
            <p className="text-sm text-muted-foreground">
              ¡Vuelve pronto!
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => {
                const author = article.author as { full_name: string; photo_url: string | null } | null
                return (
                  <ArticleCard
                    key={article.id}
                    title={article.title}
                    summary={article.summary}
                    headerImageUrl={article.header_image_url}
                    slug={article.slug}
                    publishedAt={article.published_at!}
                    authorName={author?.full_name || 'Autor'}
                    authorPhotoUrl={author?.photo_url || null}
                  />
                )
              })}
            </div>

            {totalPages > 1 && (
              <nav className="mt-12 flex items-center justify-center gap-4">
                {hasPrev ? (
                  <Link
                    href={`/informativo?page=${currentPage - 1}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    <ChevronLeft className="size-4" />
                    Anterior
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-transparent px-4 py-2 text-sm font-medium text-muted-foreground/50">
                    <ChevronLeft className="size-4" />
                    Anterior
                  </span>
                )}

                <span className="text-sm text-muted-foreground">
                  {currentPage} / {totalPages}
                </span>

                {hasNext ? (
                  <Link
                    href={`/informativo?page=${currentPage + 1}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    Siguiente
                    <ChevronRight className="size-4" />
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-transparent px-4 py-2 text-sm font-medium text-muted-foreground/50">
                    Siguiente
                    <ChevronRight className="size-4" />
                  </span>
                )}
              </nav>
            )}
          </>
        )}
      </section>
      <Footer />
    </main>
  )
}
