import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-card">
      <div className="aspect-[16/9] w-full animate-pulse bg-muted" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
        <div className="mt-auto flex items-center gap-3 pt-2">
          <div className="size-8 animate-pulse rounded-full bg-muted" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-24 animate-pulse rounded bg-muted" />
            <div className="h-2.5 w-32 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function InformativoLoading() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-2 h-9 w-48 animate-pulse rounded bg-muted" />
          <div className="mx-auto h-5 w-64 animate-pulse rounded bg-muted" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
      <Footer />
    </main>
  )
}
