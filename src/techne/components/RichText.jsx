import { Fragment } from 'react'

const TOKEN = /(\*\*[^*]+\*\*|\*[^*]+\*)/g

/**
 * Minimal inline markdown: **bold** and *italic*. Plenty for the bio and
 * project blurbs (replaces the old react-markdown dependency).
 */
export default function RichText({ text }) {
  const parts = String(text).split(TOKEN).filter(Boolean)
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return <strong key={i}>{p.slice(2, -2)}</strong>
    }
    if (p.startsWith('*') && p.endsWith('*')) {
      return <em key={i}>{p.slice(1, -1)}</em>
    }
    return <Fragment key={i}>{p}</Fragment>
  })
}
