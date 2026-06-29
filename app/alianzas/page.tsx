import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import AlianzasGrid from '@/components/alianzas-grid'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Alianzas | Pa'lante Con El Saber",
  description: "Conoce las alianzas estratégicas que hacen posible Pa'lante Con El Saber.",
  keywords: ["alianzas Pa'lante Con El Saber", "organizaciones aliadas", "patrocinadores"],
  openGraph: {
    title: "Alianzas | Pa'lante Con El Saber",
    description: "Conoce las alianzas estratégicas que hacen posible Pa'lante Con El Saber.",
    url: "https://palanteconelsaber.site/alianzas",
    siteName: "Pa'lante Con El Saber",
    images: [{ url: "https://palanteconelsaber.site/logo-white.png" }],
    locale: "es_PA",
    type: "website",
  },
}

export default function Alianzas() {
  return (
    <div>
      <Navbar />
      <AlianzasGrid />
      <Footer />
    </div>
  );
}
