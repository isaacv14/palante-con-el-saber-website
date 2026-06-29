import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { getSupabaseAdmin } from '@/lib/supabase'
import ArticleContent from '@/components/informativo/ArticleContent'
import AuthorBio from '@/components/informativo/AuthorBio'
import CommentsSection from '@/components/informativo/CommentsSection'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { User, Calendar } from 'lucide-react'
import type { Metadata } from 'next'

export const revalidate = 60

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const supabase = getSupabaseAdmin()
    const { data } = await supabase
      .from('articles')
      .select('slug')
      .eq('status', 'published')

    return (data || []).map((a) => ({ slug: a.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const supabase = getSupabaseAdmin()
    const { data } = await supabase
      .from('articles')
      .select('title, summary, header_image_url')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (!data) return {}

    return {
      title: `${data.title} | Pa'lante Con El Saber`,
      description: data.summary,
      openGraph: {
        title: data.title,
        description: data.summary,
        images: data.header_image_url ? [{ url: data.header_image_url }] : [],
        url: `https://palanteconelsaber.site/informativo/${slug}`,
        siteName: "Pa'lante Con El Saber",
        locale: 'es_PA',
        type: 'article',
      },
    }
  } catch {
    return {}
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params

  const supabase = getSupabaseAdmin()

  const { data: article } = await supabase
    .from('articles')
    .select('*, author:author_id(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!article) {
    notFound()
  }

  const author = article.author as {
    full_name: string
    photo_url: string | null
    bio: string | null
    instagram: string | null
    linkedin: string | null
    email: string | null
  }

  const publishedDate = format(
    new Date(article.published_at),
    "d 'de' MMMM 'de' yyyy",
    { locale: es },
  )

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <article>
        {article.header_image_url && (
          <div className="relative h-64 w-full overflow-hidden md:h-80 lg:h-[400px]">
            <img
              src={article.header_image_url}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
          <header className="mb-8">
            <h1 className="text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl">
              {article.title}
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {article.summary}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <div className="size-10 overflow-hidden rounded-full bg-muted">
                {author.photo_url ? (
                  <img
                    src={author.photo_url}
                    alt={author.full_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <User className="size-5 text-muted-foreground/60" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {author.full_name}
                </p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="size-3" />
                  {publishedDate}
                </p>
              </div>
            </div>
          </header>

          <section className="mb-12">
            <ArticleContent content={article.body} />
          </section>

          {author.bio && (
            <section>
              <hr className="mb-8 border-border" />
              <AuthorBio
                fullName={author.full_name}
                photoUrl={author.photo_url}
                bio={author.bio}
                instagram={author.instagram}
                linkedin={author.linkedin}
                email={author.email}
              />
            </section>
          )}

          <CommentsSection articleId={article.id} />
        </div>
      </article>

      <Footer />
    </main>
  )
}
