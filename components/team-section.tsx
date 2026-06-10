"use client"

import Image from "next/image"
import { Reveal, StaggerContainer, StaggerItem } from "@/components/animations"

interface TeamMember {
  name: string
  role: string
  category: "Coordinador" | "Mentor"
  image: string
}

const team: TeamMember[] = [
  { name: "Eduardo Navarro", role: "Coordinador General", category: "Coordinador", image: "/team/eduardo.webp" },
  { name: "Gabriel Almengor", role: "Subcoordinador General", category: "Coordinador", image: "/team/gabriel.webp" },
  { name: "Emely Van Horn", role: "Secretaria General", category: "Coordinador", image: "/team/emely.webp" },
  { name: "Elías González", role: "Director de Presupuesto", category: "Coordinador", image: "/team/elias.webp" },
  { name: "Isaac Vergara", role: "Coord. Académico", category: "Coordinador", image: "/team/isaac.webp" },
  { name: "Makenzie Agrazal", role: "Coord. Académica", category: "Coordinador", image: "/team/makenzie.webp" },
  { name: "Paola Fong", role: "Coord. de Datos", category: "Coordinador", image: "/team/paola.webp" },
  { name: "Alfonso Quintero", role: "Coord. de Datos", category: "Coordinador", image: "/team/alfonso.webp" },
  { name: "Sharlis Herrera", role: "Coord. de Logística", category: "Coordinador", image: "/team/sharlis.webp" },
  { name: "Samantha Araúz", role: "Coord. de Redes", category: "Coordinador", image: "/team/samantha.webp" },
  { name: "Noreida Machado", role: "Coord. de Redes", category: "Coordinador", image: "/team/noreida.webp" },
  { name: "Julio César Barría", role: "Mentor", category: "Mentor", image: "/team/julio.webp" },
  { name: "Yarlines García", role: "Mentor Asistente", category: "Mentor", image: "/team/yarlines.webp" },
  { name: "Aarón Murillo", role: "Mentor Académico", category: "Mentor", image: "/team/aaron.webp" },
]

export default function TeamSection() {
  const coordinators = team.filter((m) => m.category === "Coordinador")
  const mentors = team.filter((m) => m.category === "Mentor")

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <Reveal className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Nuestro Equipo</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Un grupo multidisciplinario comprometido con la educación y el desarrollo
            de nuevas oportunidades para todos.
          </p>
        </Reveal>

        <Reveal className="mb-20" direction="left" distance={30}>
          <h3 className="text-2xl font-semibold text-blue-700 mb-8 border-l-4 border-blue-700 pl-4">
            Coordinadores
          </h3>
        </Reveal>
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20">
          {coordinators.map((member, index) => (
            <StaggerItem key={index}>
              <TeamCard member={member} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <Reveal className="mb-8" direction="left" distance={30}>
          <h3 className="text-2xl font-semibold text-emerald-700 mb-8 border-l-4 border-emerald-700 pl-4">
            Mentores
          </h3>
        </Reveal>
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl">
          {mentors.map((member, index) => (
            <StaggerItem key={index}>
              <TeamCard member={member} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:-translate-y-2 hover:shadow-xl">
      <div className="relative aspect-510/740 w-full overflow-hidden">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-5">
        <h4 className="text-lg font-bold text-slate-800">{member.name}</h4>
        <p className="text-sm font-medium text-blue-600 uppercase tracking-wider">
          {member.role}
        </p>
      </div>
    </div>
  )
}
