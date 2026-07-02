'use client'

import { useEffect, useState } from 'react'
import { generateHTML } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { Node } from '@tiptap/core'
import { getCloudinaryUrl, isCloudinaryPublicId } from '@/lib/cloudinary'

const PublicFigureExtension = Node.create({
  name: 'figure',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: '' },
      caption: { default: '' },
    }
  },

  parseHTML() {
    return [{ tag: 'figure' }]
  },

  renderHTML({ HTMLAttributes }) {
    const src = HTMLAttributes.src as string | null
    const imgSrc = src && isCloudinaryPublicId(src) ? getCloudinaryUrl(src, { width: 800 }) : src

    return [
      'figure',
      {},
      ['img', { src: imgSrc, alt: HTMLAttributes.alt || '' }],
      ['figcaption', {}, HTMLAttributes.caption || ''],
    ]
  },
})

const extensions = [
  StarterKit.configure({ heading: { levels: [2, 3] } }),
  PublicFigureExtension,
]

export default function ArticleContent({ content }: { content: unknown }) {
  const [html, setHtml] = useState('')

  useEffect(() => {
    if (content) {
      setHtml(generateHTML(content, extensions))
    }
  }, [content])

  if (!content) return null
  if (!html) return null

  return (
    <div
      className="prose-custom max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
