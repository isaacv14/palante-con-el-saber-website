"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/problema", label: "El problema" },
    { href: "/equipo", label: "Nuestro equipo" },
    { href: "/alianzas", label: "Alianzas" },
    { href: "/#contactanos", label: "Contáctanos" },
    { href: "https://chat.palanteconelsaber.site", label: "El Fren AI", highlight: true },
  ]

  return (
    <div className='sticky top-0 z-50 shadow-sm relative'>
    <header className="sticky top-0 z-50 bg-background shadow-sm">
      <nav className="relative container mx-auto px-4 py-2">
        <div className="flex items-center justify-between relative">
          {/* Logo - Solo imagen */}
          <a href="/" className="flex items-center">
            <img 
              src="/favicon.svg"
              alt="Pa'lante con el saber"
              className="h-20 w-auto object-contain"
            />
          </a>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                {link.highlight ? (
                  <a
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="bg-primary text-primary-foreground font-semibold px-5 py-2 rounded-full hover:opacity-90 transition-opacity shadow-sm"
                  >
                    {link.label}
                  </a>
                ) : (
                  <a
                    href={link.href}
                    className="text-foreground font-medium hover:text-primary transition-colors underline-offset-4"
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>
    </header>
      {/* Mobile Navigation */}
      <div
        className={`
          md:hidden absolute left-0 w-full bg-background border-t border-border z-30
          transition-transform duration-350 ease-in-out
          ${isMenuOpen ? "translate-y-0" : "-translate-y-full"}
        `}
        style={{ top: '100%' }}
      >
        <ul className="flex flex-col gap-4 p-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              {link.highlight ? (
                <a
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="block bg-primary text-primary-foreground font-semibold px-5 py-3 rounded-full text-center hover:opacity-90 transition-opacity"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <a
                  href={link.href}
                  className="block text-foreground font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
