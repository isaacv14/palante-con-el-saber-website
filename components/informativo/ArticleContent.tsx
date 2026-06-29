import { generateHTML } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { Node } from '@tiptap/core'

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
    return [
      'figure',
      {},
      ['img', { src: HTMLAttributes.src, alt: HTMLAttributes.alt || '' }],
      ['figcaption', {}, HTMLAttributes.caption || ''],
    ]
  },
})

const extensions = [
  StarterKit.configure({ heading: { levels: [2, 3] } }),
  PublicFigureExtension,
]

export default function ArticleContent({ content }: { content: unknown }) {
  if (!content) return null

  const html = generateHTML(content, extensions)

  return (
    <div
      className="prose-custom max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
