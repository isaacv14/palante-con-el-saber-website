import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import type { NodeViewProps } from '@tiptap/react'

function FigureNodeView({ node, updateAttributes }: NodeViewProps) {
  const { src, alt, caption } = node.attrs

  return (
    <NodeViewWrapper as="figure" className="group relative my-4">
      <img
        src={src}
        alt={alt || ''}
        className="w-full rounded-lg object-cover"
      />
      <figcaption className="mt-1 text-xs italic text-muted-foreground">
        <input
          type="text"
          value={caption || ''}
          onChange={(e) => updateAttributes({ caption: e.target.value })}
          placeholder="Agregar fuente de la imagen..."
          className="w-full border-0 border-b border-dashed border-border bg-transparent pb-0.5 text-xs italic text-muted-foreground focus:border-primary/50 focus:outline-none"
          onPointerDown={(e) => e.stopPropagation()}
        />
      </figcaption>
    </NodeViewWrapper>
  )
}

export const FigureExtension = Node.create({
  name: 'figure',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: '' },
      caption: { default: '' },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'figure',
        getAttrs(node) {
          const el = node as HTMLElement
          const img = el.querySelector('img')
          const figcaption = el.querySelector('figcaption')
          return {
            src: img?.getAttribute('src') || null,
            alt: img?.getAttribute('alt') || '',
            caption: figcaption?.textContent || '',
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'figure',
      mergeAttributes(HTMLAttributes),
      ['img', { src: HTMLAttributes.src, alt: HTMLAttributes.alt || '' }],
      ['figcaption', {}, HTMLAttributes.caption || ''],
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(FigureNodeView)
  },

  addCommands() {
    return {
      setFigure:
        (attrs: { src: string; alt?: string; caption?: string }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: 'figure',
            attrs: {
              src: attrs.src,
              alt: attrs.alt || '',
              caption: attrs.caption || '',
            },
          })
        },
    }
  },
})
