import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import TeamSection from '@/components/team-section'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Nuestro Equipo | Pa'lante Con El Saber",
  description: "Conoce al equipo juvenil panameño detrás de Pa'lante Con El Saber, nacido en el Laboratorio Latinoamericano de Acción Ciudadana 2026.",
  keywords: ["equipo Pa'lante Con El Saber", "jóvenes panameños", "Laboratorio Acción Ciudadana"],
  openGraph: {
    title: "Nuestro Equipo | Pa'lante Con El Saber",
    description: "Conoce al equipo juvenil panameño detrás de Pa'lante Con El Saber.",
    url: "https://palanteconelsaber.site/equipo",
    siteName: "Pa'lante Con El Saber",
    images: [{ url: "https://palanteconelsaber.site/logo-white.png" }],
    locale: "es_PA",
    type: "website",
  },
}

export default function Equipo() {
  return (
    <div>
      <Navbar />
      <TeamSection />
      <Footer />
    </div>
  );
}