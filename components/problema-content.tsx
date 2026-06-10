"use client"

import {
  AlertTriangle,
  Users,
  TrendingDown,
  Eye,
  GraduationCap,
  Frown,
  UserX,
  Gauge,
  BrainCog,
  ArrowRight,
  Lightbulb,
  MessageCircle,
  ClipboardCheck,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Reveal, StaggerContainer, StaggerItem, FadeIn } from "@/components/animations"

const causas = [
  {
    icon: Users,
    title: "Presiones familiares",
    description: "Decisiones influenciadas por expectativas familiares sin considerar los intereses del estudiante",
  },
  {
    icon: TrendingDown,
    title: "Tendencias sociales",
    description: "Elección basada en lo que es popular o lo que eligen los amigos",
  },
  {
    icon: Eye,
    title: "Desconocimiento de habilidades",
    description: "Falta de autoconocimiento sobre fortalezas, debilidades e intereses personales",
  },
  {
    icon: GraduationCap,
    title: "Poca visión universitaria",
    description: "Desconexión entre la elección del bachillerato y las metas profesionales futuras",
  },
]

const consecuencias = [
  { icon: UserX, title: "Altas tasas de deserción escolar media", color: "bg-red-500/10 text-red-600" },
  { icon: Frown, title: "Frustración académica", color: "bg-orange-500/10 text-orange-600" },
  { icon: BrainCog, title: "Poco desarrollo personal", color: "bg-yellow-500/10 text-yellow-600" },
  { icon: Gauge, title: "Disminución de la eficiencia del sistema educativo", color: "bg-purple-500/10 text-purple-600" },
  { icon: TrendingDown, title: "Poca productividad", color: "bg-blue-500/10 text-blue-600" },
]

const soluciones = [
  {
    icon: ClipboardCheck,
    title: "Talleres interactivos",
    description: "Actividades prácticas para descubrir intereses y habilidades",
  },
  {
    icon: BrainCog,
    title: "Análisis personalizados",
    description: "Evaluaciones individuales para conocer tu perfil vocacional",
  },
  {
    icon: Sparkles,
    title: "Actividades interactivas",
    description: "Dinámicas grupales que facilitan el autoconocimiento",
  },
  {
    icon: MessageCircle,
    title: "Charlas con profesionales",
    description: "Contacto directo con expertos de diferentes áreas",
  },
]

export default function ProblemaContent() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-secondary/5" />
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">Situación actual</span>
              </div>
            </FadeIn>
            <Reveal delay={0.15}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Enfrentamos un <span className="text-primary">problema</span>.
              </h1>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                En el contexto educativo actual, un porcentaje significativo de jóvenes entre
                <strong className="text-foreground"> 14 y 15 años</strong> que cursan la premedia
                <strong className="text-foreground"> (9° grado)</strong> eligen su bachiller sin contar
                con un proceso estructurado de orientación académica.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Causas Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Basándose principalmente en...
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Estos factores influyen negativamente en la toma de decisiones de los estudiantes
            </p>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {causas.map((causa, index) => (
              <StaggerItem key={index}>
                <div className="bg-background border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg shrink-0">
                      <causa.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground mb-2">
                        {causa.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {causa.description}
                      </p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Consecuencias Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Esta situación genera...
            </h2>
          </Reveal>

          <StaggerContainer className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {consecuencias.map((consecuencia, index) => (
              <StaggerItem key={index}>
                <div
                  className={`flex items-center gap-3 px-5 py-3 rounded-full ${consecuencia.color} border border-current/20`}
                >
                  <consecuencia.icon className="h-5 w-5 shrink-0" />
                  <span className="font-medium text-sm md:text-base">{consecuencia.title}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Solución Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-primary to-secondary opacity-95" />
        <div className="relative container mx-auto px-4">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {"Pa'lante con el saber"} <span className="font-normal">quiere cambiar eso.</span>
            </h2>
            <p className="text-white/90 text-xl">
              Pero... <span className="font-bold">¿Cómo?</span>
            </p>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {soluciones.map((solucion, index) => (
              <StaggerItem key={index}>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center hover:bg-white/20 transition-colors">
                  <div className="inline-flex p-3 bg-white/20 rounded-full mb-4">
                    <solucion.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-white mb-2">
                    {solucion.title}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {solucion.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <Reveal className="text-center mt-10">
            <p className="text-white/90 text-lg mb-6">
              Y <span className="font-bold">¡mucho más!</span>
            </p>
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold px-8"
              asChild
            >
              <Link href="/#contactanos">
                <Lightbulb className="mr-2 h-5 w-5" />
                Quiero saber más
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  )
}
