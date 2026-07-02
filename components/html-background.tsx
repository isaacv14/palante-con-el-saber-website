'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function HtmlBackground() {
  const pathname = usePathname()

  useEffect(() => {
    document.documentElement.style.backgroundColor = ''
    document.body.style.backgroundColor = ''
  }, [pathname])

  return null
}
