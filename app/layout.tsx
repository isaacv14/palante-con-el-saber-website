import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from "@vercel/speed-insights/next"
import HtmlBackground from '@/components/html-background'
import './globals.css'

export const metadata: Metadata = {
  title: "Pa'lante Con El Saber",
  description: "Acompañamos a estudiantes de 9° grado en la elección de su bachillerato. Proyecto juvenil panameño de orientación vocacional.",
  keywords: ["bachillerato Panamá", "elegir bachiller", "educación Panamá", "Canal de Panamá", "Laboratorio Latinoamericano de Acción Ciudadana", "LLAC", "palante con el saber", "jovenes unidos por la educacion"],
  openGraph: {
    title: "Pa'lante Con El Saber",
    description: "Decide bien hoy, para llegar lejos mañana.",
    url: "https://palanteconelsaber.site",
    siteName: "Pa'lante Con El Saber",
    images: [{ url: "https://palanteconelsaber.site/logo-white.png" }],
    locale: "es_PA",
    type: "website",
  },
  generator: 'Isaac Vergara',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="font-[system-ui] antialiased" suppressHydrationWarning>
        {children}
        <HtmlBackground />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
