"use client"

import { Reveal, StaggerContainer, StaggerItem } from "@/components/animations"
import AcpLogo from '@/public/alliances-logos/acp.webp';
import JuxlaeLogo from '@/public/alliances-logos/juxlae.webp';
import AspadeLogo from '@/public/alliances-logos/aspade.webp';
import HardplotLogo from '@/public/alliances-logos/hardplot.webp';
import JudLogo from '@/public/alliances-logos/jud.webp';
import SilveraLezcanoLogo from '@/public/alliances-logos/silvera-lezcano.webp';
import AepsiLogo from '@/public/alliances-logos/aepsi.webp';
import InnovaNationLogo from '@/public/alliances-logos/innova-nation.webp';
import VaczLogo from '@/public/alliances-logos/vacz.webp';
import DaleCarnegie from '@/public/alliances-logos/dale-carnegie.webp';
import CkiUsmaLogo from '@/public/alliances-logos/cki-usma.webp';
import OratoriaLogo from '@/public/alliances-logos/oratoria.webp';
import DidacticScienceLogo from '@/public/alliances-logos/didactic-science.webp';
import CibercoltsLogo from '@/public/alliances-logos/cibercolts.webp';
import WrenchhuntersLogo from '@/public/alliances-logos/wrenchhunters.webp';
import OplLogo from '@/public/alliances-logos/opl.webp';
import BoardGameLogo from '@/public/alliances-logos/board-game.webp';
import AyudingaLogo from '@/public/alliances-logos/ayudinga.webp';
import ScentedPerfumesLogo from '@/public/alliances-logos/scented-perfumes.webp';
import TutoriasPanamaLogo from '@/public/alliances-logos/tutorias-panama.webp';
import GenovixLogo from '@/public/alliances-logos/genovix.webp';
import HiTeaLogo from '@/public/alliances-logos/hi-tea.webp';
import ChinoPanamaLogo from '@/public/alliances-logos/chino-panameno.webp';
import McDonaldsLogo from '@/public/alliances-logos/mcdonalds.webp';
import GlobalSpeakerLogo from '@/public/alliances-logos/global-speaker.webp';
import SerTvLogo from '@/public/alliances-logos/ser-tv.webp';
import HispaniaTvLogo from '@/public/alliances-logos/hispania-tv.webp';
import EcoTvLogo from '@/public/alliances-logos/eco-tv.webp';
import OmegaStereoLogo from '@/public/alliances-logos/omega-stereo.webp';
import RadioMariaLogo from '@/public/alliances-logos/radio-maria.webp';
import CreoEnTiLogo from '@/public/alliances-logos/creo-en-ti.webp';

interface Alliance {
  logo: any
  title: string
  href: string
}

const alliances: Alliance[] = [
  { logo: AcpLogo, title: "Canal de Panamá", href: "https://www.pancanal.com/" },
  { logo: JuxlaeLogo, title: "Jóvenes Unidos Por La Educación", href: "https://hablemosdeeducacion.com/" },
  { logo: AspadeLogo, title: "Aspade", href: "https://www.aspadepanama.com/" },
  { logo: HardplotLogo, title: "Hard Plot Center", href: "https://hardplot.com" },
  { logo: JudLogo, title: "Jóvenes Unidos Por El Diálogo", href: "https://www.instagram.com/jud_usma" },
  { logo: SilveraLezcanoLogo, title: "Silvera Lezcano", href: "https://www.silalaw.com/" },
  { logo: AepsiLogo, title: "Aepsi", href: "https://www.instagram.com/aepsi" },
  { logo: InnovaNationLogo, title: "Innova Nation", href: "https://www.instagram.com/innovanation.pa/" },
  { logo: VaczLogo, title: "Vacz", href: "https://www.vaczart.com/" },
  { logo: DaleCarnegie, title: "Dale Carnegie Training", href: "https://www.dalecarnegiepanama.com" },
  { logo: CkiUsmaLogo, title: "CKI USMA", href: "https://www.instagram.com/cki.usma" },
  { logo: OratoriaLogo, title: "Oratoria Panamá", href: "https://oratoria.com.pa" },
  { logo: DidacticScienceLogo, title: "Didactics Science Academy", href: "https://www.instagram.com/didactics.science.academy" },
  { logo: CibercoltsLogo, title: "CyberColts Robotics", href: "https://www.instagram.com/cybercolts_pty" },
  { logo: WrenchhuntersLogo, title: "Wrenchhunters", href: "https://wrenchhunters.org" },
  { logo: OplLogo, title: "OPL", href: "https://www.instagram.com/opl_robotics" },
  { logo: BoardGameLogo, title: "Board Game Party", href: "https://www.instagram.com/boardgamepartypty" },
  { logo: AyudingaLogo, title: "Fundación AYUDINGA", href: "https://www.ayudinga.org" },
  { logo: ScentedPerfumesLogo, title: "Scented Perfumes", href: "https://www.instagram.com/scented.parfums" },
  { logo: TutoriasPanamaLogo, title: "Tutorías Panamá", href: "https://www.instagram.com/tutorias_panama" },
  { logo: GenovixLogo, title: "Genovix S.A.", href: "" },
  { logo: HiTeaLogo, title: "Hi-Tea", href: "https://www.instagram.com/hitea.pa" },
  { logo: ChinoPanamaLogo, title: "Centro Cultural Chino Panameño", href: "https://www.ccchp-isys.edu.pa" },
  { logo: McDonaldsLogo, title: "McDonald's Panamá", href: "https://www.instagram.com/mcdonalds_pa" },
  { logo: GlobalSpeakerLogo, title: "Global Speakers", href: "https://www.instagram.com/globalspeakers.ac" },
  { logo: SerTvLogo, title: "SerTV Noticias", href: "https://sertv.gob.pa" },
  { logo: HispaniaTvLogo, title: "HispaniaTV", href: "https://www.hispaniamedia.tv" },
  { logo: EcoTvLogo, title: "ECO TV", href: "https://www.ecotvpanama.com" },
  { logo: OmegaStereoLogo, title: "Omega Stereo", href: "https://www.omegastereo.com" },
  { logo: RadioMariaLogo, title: "Radio María", href: "https://radiomaria.pa" },
  { logo: CreoEnTiLogo, title: "Fundación Creo en Ti", href: "https://fundacioncreoenti.com" },
];

function AllianceCard({ alliance, index }: { alliance: Alliance; index: number }) {
  return (
    <StaggerItem>
      <a
        href={alliance.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col items-center justify-center gap-4 rounded-2xl bg-white p-6 shadow-sm transition-all hover:-translate-y-2 hover:shadow-lg"
      >
        <div className="flex h-24 w-full items-center justify-center">
          <img
            src={alliance.logo.src}
            alt={alliance.title}
            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <span className="text-center text-sm font-medium text-gray-700">
          {alliance.title}
        </span>
      </a>
    </StaggerItem>
  )
}

export default function AlianzasGrid() {
  return (
    <section className="bg-gray-100 py-20">
      <div className="container mx-auto px-4">
        <Reveal className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">Alianzas Estratégicas</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Organizaciones que confían en nuestra misión y colaboran para hacerla realidad.
          </p>
        </Reveal>

        <StaggerContainer className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {alliances.map((alliance, index) => (
            <AllianceCard key={index} alliance={alliance} index={index} />
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
