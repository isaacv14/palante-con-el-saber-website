import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ProblemaContent from "@/components/problema-content"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "El Problema | Pa'lante Con El Saber",
  description: "Conoce por qué muchos jóvenes panameños eligen su bachillerato sin orientación adecuada y cómo Pa'lante Con El Saber busca cambiar eso.",
  keywords: ["problema educativo Panamá", "orientación académica", "premedia Panamá"],
  openGraph: {
    title: "El Problema | Pa'lante Con El Saber",
    description: "Conoce por qué muchos jóvenes panameños eligen su bachillerato sin orientación adecuada.",
    url: "https://palanteconelsaber.site/problema",
    siteName: "Pa'lante Con El Saber",
    images: [{ url: "https://palanteconelsaber.site/logo-white.png" }],
    locale: "es_PA",
    type: "website",
  },
}

export default function ProblemaPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <ProblemaContent />
      <Footer />
    </main>
  )
}
