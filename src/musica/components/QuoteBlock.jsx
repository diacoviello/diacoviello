import { useEffect, useRef } from 'react'
import Reveal from './Reveal.jsx'
import SignatureTrace from './SignatureTrace.jsx'

const MIN_QUOTE_FONT_PX = 15

/**
 * Quote + attribution pair for a page's <header className="m-pagehead">.
 * Pass `as="h1"` to use the quote as the page's own headline (see
 * musica/pages/About.jsx); otherwise it renders as a secondary blockquote
 * under the page's existing h1 title.
 *
 * Also owns the divider that follows: it's centered (via plain CSS,
 * margin-inline: auto) within .quote-block, which is itself either
 * full-width (the centered .m-pagehead subpages — so the divider ends up
 * centered on the page) or scoped to a narrower column (Home's left-aligned
 * hero — so the divider ends up centered under the quote/signature there).
 * An earlier version tried to anchor the divider under the first couple
 * letters of the signature via JS + a tuned offset, but that offset was
 * fit to one specific name/layout and broke down for other author names and
 * for Home's narrower column (drifting off-position, even clipping off the
 * left edge) — plain centering is simpler and works everywhere.
 *
 * Renders just the divider when `quote` is empty, so a page can have this
 * wired up ahead of time — just paste `quote`/`author` in later.
 */
export default function QuoteBlock({
  quote,
  author,
  as = 'blockquote',
  maxLines = 3,
  delay = 0.05,
  authorDelay = 0.08,
}) {
  const quoteRef = useRef(null)

  useEffect(() => {
    const el = quoteRef.current
    if (!el) return

    const fitToMaxLines = () => {
      el.style.fontSize = ''
      const computed = window.getComputedStyle(el)
      let fontSize = parseFloat(computed.fontSize)
      let lineHeight = parseFloat(computed.lineHeight)
      if (Number.isNaN(lineHeight)) lineHeight = fontSize * 1.2

      let guard = 0
      while (
        el.scrollHeight > lineHeight * maxLines + 1 &&
        fontSize > MIN_QUOTE_FONT_PX &&
        guard < 60
      ) {
        fontSize -= 1
        el.style.fontSize = `${fontSize}px`
        lineHeight = parseFloat(window.getComputedStyle(el).lineHeight)
        guard += 1
      }
    }

    fitToMaxLines()
    document.fonts?.ready?.then(fitToMaxLines)
    window.addEventListener('resize', fitToMaxLines)
    return () => window.removeEventListener('resize', fitToMaxLines)
  }, [quote, maxLines])

  return (
    <div className="quote-block">
      {quote && (
        <Reveal ref={quoteRef} as={as} className="page-quote" delay={delay}>
          {quote}
        </Reveal>
      )}
      {quote && author && (
        <Reveal as="p" className="page-quote-attr" from="up" delay={authorDelay}>
          <span className="page-quote-attr__mark">
            <span className="page-quote-attr__dash">— </span>
            <SignatureTrace text={author} className="page-quote-attr__signature" />
          </span>
        </Reveal>
      )}
      <div className="m-divider" />
    </div>
  )
}
