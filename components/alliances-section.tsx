"use client"

import { useState, useEffect } from "react"
import LogoLoop from './LogoLoop';
import AcpLogo from '../public/alliances-logos/acp.webp';
import JuxlaeLogo from '../public/alliances-logos/juxlae.webp';
import AspadeLogo from '../public/alliances-logos/aspade.webp';
import HardplotLogo from '../public/alliances-logos/hardplot.webp';
import JudLogo from '../public/alliances-logos/jud.webp';
import SilveraLezcanoLogo from '../public/alliances-logos/silvera-lezcano.webp';
import AepsiLogo from '../public/alliances-logos/aepsi.webp';
import InnovaNationLogo from '../public/alliances-logos/innova-nation.webp';
import VaczLogo from '../public/alliances-logos/vacz.webp';
import DaleCarnegie from '../public/alliances-logos/dale-carnegie.webp';
import CkiUsmaLogo from '../public/alliances-logos/cki-usma.webp';
import OratoriaLogo from '../public/alliances-logos/oratoria.webp';
import DidacticScienceLogo from '../public/alliances-logos/didactic-science.webp';
import CibercoltsLogo from '../public/alliances-logos/cibercolts.webp';
import WrenchhuntersLogo from '../public/alliances-logos/wrenchhunters.webp';
import OplLogo from '../public/alliances-logos/opl.webp';
import BoardGameLogo from '../public/alliances-logos/board-game.webp';
import AyudingaLogo from '../public/alliances-logos/ayudinga.webp';
import ScentedPerfumesLogo from '../public/alliances-logos/scented-perfumes.webp';
import TutoriasPanamaLogo from '../public/alliances-logos/tutorias-panama.webp';
import GenovixLogo from '../public/alliances-logos/genovix.webp';
import HiTeaLogo from '../public/alliances-logos/hi-tea.webp';
import ChinoPanamaLogo from '../public/alliances-logos/chino-panameno.webp';
import McDonaldsLogo from '../public/alliances-logos/mcdonalds.webp';
import GlobalSpeakerLogo from '../public/alliances-logos/global-speaker.webp';
import SerTvLogo from '../public/alliances-logos/ser-tv.webp';
import HispaniaTvLogo from '../public/alliances-logos/hispania-tv.webp';
import EcoTvLogo from '../public/alliances-logos/eco-tv.webp';
import OmegaStereoLogo from '../public/alliances-logos/omega-stereo.webp';
import RadioMariaLogo from '../public/alliances-logos/radio-maria.webp';
import CreoEnTiLogo from '../public/alliances-logos/creo-en-ti.webp';

const techLogos = [
  { node: <img src={AcpLogo.src} alt="ACP" />, title: "ACP", href: "https://www.pancanal.com/" },
  { node: <img src={JuxlaeLogo.src} alt="Juxlae" />, title: "Juxlae", href: "https://hablemosdeeducacion.com/" },
  { node: <img src={AspadeLogo.src} alt="Aspade" />, title: "Aspade", href: "https://www.aspadepanama.com/" },
  { node: <img src={HardplotLogo.src} alt="Hardplot" />, title: "Hardplot", href: "https://hardplot.com" },
  { node: <img src={JudLogo.src} alt="Jud" />, title: "Juped", href: "https://www.instagram.com/jud_usma" },
  { node: <img src={SilveraLezcanoLogo.src} alt="Silvera Lezcano" />, title: "Silvera Lezcano", href: "https://www.silalaw.com/" },
  { node: <img src={AepsiLogo.src} alt="Aepsi" />, title: "Aepsi", href: "https://www.instagram.com/aepsi" },
  { node: <img src={InnovaNationLogo.src} alt="Innova Nation" />, title: "Innova Nation", href: "https://www.instagram.com/innovanation.pa/" },
  { node: <img src={VaczLogo.src} alt="Vacz" />, title: "Vacz", href: "https://www.vaczart.com/" },
  { node: <img src={DaleCarnegie.src} alt="Dale Carnegie Training" />, title: "Dale Carnegie Training", href: "https://www.dalecarnegiepanama.com" },
  { node: <img src={CkiUsmaLogo.src} alt="CKI USMA" />, title: "CKI USMA", href: "https://www.instagram.com/cki.usma" },
  { node: <img src={OratoriaLogo.src} alt="Oratoria Panamá" />, title: "Oratoria Panamá", href: "https://oratoria.com.pa" },
  { node: <img src={DidacticScienceLogo.src} alt="Didactics Science Academy" />, title: "Didactics Science Academy", href: "https://www.instagram.com/didactics.science.academy" },
  { node: <img src={CibercoltsLogo.src} alt="CyberColts Robotics" />, title: "CyberColts Robotics", href: "https://www.instagram.com/cybercolts_pty" },
  { node: <img src={WrenchhuntersLogo.src} alt="Wrenchhunters" />, title: "Wrenchhunters", href: "https://wrenchhunters.org" },
  { node: <img src={OplLogo.src} alt="OPL" />, title: "OPL", href: "https://www.instagram.com/opl_robotics" },
  { node: <img src={BoardGameLogo.src} alt="Board Game Party" />, title: "Board Game Party", href: "https://www.instagram.com/boardgamepartypty" },
  { node: <img src={AyudingaLogo.src} alt="Fundación AYUDINGA" />, title: "Fundación AYUDINGA", href: "https://www.ayudinga.org" },
  { node: <img src={ScentedPerfumesLogo.src} alt="Scented Perfumes" />, title: "Scented Perfumes", href: "https://www.instagram.com/scented.parfums" },
  { node: <img src={TutoriasPanamaLogo.src} alt="Tutorías Panamá" />, title: "Tutorías Panamá", href: "https://www.instagram.com/tutorias_panama" },
  { node: <img src={GenovixLogo.src} alt="Genovix S.A." />, title: "Genovix S.A.", href: "" },
  { node: <img src={HiTeaLogo.src} alt="Hi-Tea" />, title: "Hi-Tea", href: "https://www.instagram.com/hitea.pa" },
  { node: <img src={ChinoPanamaLogo.src} alt="Centro Cultural Chino Panameño" />, title: "Centro Cultural Chino Panameño", href: "https://www.ccchp-isys.edu.pa" },
  { node: <img src={McDonaldsLogo.src} alt="McDonald's Panamá" />, title: "McDonald's Panamá", href: "https://www.instagram.com/mcdonalds_pa" },
  { node: <img src={GlobalSpeakerLogo.src} alt="Global Speakers" />, title: "Global Speakers", href: "https://www.instagram.com/globalspeakers.ac" },
  { node: <img src={SerTvLogo.src} alt="SerTV Noticias" />, title: "SerTV Noticias", href: "https://sertv.gob.pa" },
  { node: <img src={HispaniaTvLogo.src} alt="HispaniaTV" />, title: "HispaniaTV", href: "https://www.hispaniamedia.tv" },
  { node: <img src={EcoTvLogo.src} alt="ECO TV" />, title: "ECO TV", href: "https://www.ecotvpanama.com" },
  { node: <img src={OmegaStereoLogo.src} alt="Omega Stereo" />, title: "Omega Stereo", href: "https://www.omegastereo.com" },
  { node: <img src={RadioMariaLogo.src} alt="Radio María" />, title: "Radio María", href: "https://radiomaria.pa" },
  { node: <img src={CreoEnTiLogo.src} alt="Fundación Creo en Ti" />, title: "Fundación Creo en Ti", href: "https://fundacioncreoenti.com" },
];

export default function AllianceSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // breakpoint md
    };

    handleResize(); // ejecutar al inicio
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section id="alianzas" className="pt-12 bg-gray-100">
      <h2 className="font-serif text-3xl md:text-4xl font-bold mb-8 text-center">Nuestras Alianzas</h2>
      <div style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
        <LogoLoop
          logos={techLogos}
          speed={isMobile ? 110 : 80}
          gap={isMobile ? 120 : 200}
          direction="left"
          logoHeight={100}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          fadeOutColor="#F5F5F5"
          ariaLabel="Technology partners"
          />
      </div>
      <p className="text-center pb-4 ">
        <a href="/alianzas" className="text-gray-300 hover:text-gray-200 font-semibold">
          Ver alianzas
        </a>
      </p>
    </section>
  );
}
