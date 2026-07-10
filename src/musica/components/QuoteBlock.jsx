import { useCallback, useEffect, useRef, useState } from 'react'
import Reveal from './Reveal.jsx'
import SignatureTrace from './SignatureTrace.jsx'

const MIN_QUOTE_FONT_PX = 15
// How far left of the signature's own left edge the divider should start,
// as a fraction of the signature's rendered width. Negative = starts before
// the signature (out toward the "— " dash); tuned by eye against the About
// page's "Aristotle" signature.
const DIVIDER_ANCHOR_FRACTION = -0.365

/**
 * Quote + attribution pair for a page's <header className="m-pagehead">.
 * Pass `as="h1"` to use the quote as the page's own headline (see
 * musica/pages/About.jsx); otherwise it renders as a secondary blockquote
 * under the page's existing h1 title.
 *
 * Also owns the divider that follows: centered by default, or nudged left
 * (via SignatureTrace's `onGeometry` callback + DIVIDER_ANCHOR_FRACTION
 * above) to sit near the start of the signed name when there's an author.
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
  const dividerRef = useRef(null)
  const [anchorX, setAnchorX] = useState(null)

  const handleSignatureGeometry = useCallback(({ left, width }) => {
    setAnchorX(left + DIVIDER_ANCHOR_FRACTION * width)
  }, [])

  useEffect(() => {
    const divider = dividerRef.current
    if (!divider) return
    if (anchorX == null) {
      divider.style.transform = ''
      return
    }
    divider.style.transform = ''
    const delta = anchorX - divider.getBoundingClientRect().left
    divider.style.transform = `translateX(${delta}px)`
  }, [anchorX])

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
            <SignatureTrace
              text={author}
              className="page-quote-attr__signature"
              onGeometry={handleSignatureGeometry}
            />
          </span>
        </Reveal>
      )}
      <div ref={dividerRef} className="m-divider" />
    </div>
  )
}
