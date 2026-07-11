import { useEffect, useId, useRef, useState } from 'react'

const FONT_URL = '/fonts/AlexBrush-Regular.ttf'
const STROKE_FRACTION_OF_EM = 0.022
// Approximates CSS `linear-gradient(120deg, ...)` as a direction vector, so
// the gradient (specified in userSpaceOnUse coordinates, see below) matches
// the angle used everywhere else on the page.
const GRADIENT_DX = 0.866
const GRADIENT_DY = 0.5

let fontPromise = null
function loadSignatureFont() {
  if (!fontPromise) {
    fontPromise = Promise.all([
      import('opentype.js'),
      fetch(FONT_URL).then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch ${FONT_URL}`)
        return res.arrayBuffer()
      }),
    ]).then(([opentype, buffer]) => opentype.parse(buffer))
  }
  return fontPromise
}

/**
 * Renders `text` as a real traced signature: the actual glyph outlines of
 * the loaded script font (Alex Brush) are extracted via opentype.js, one
 * <path> per letter, then animated stroke-first in sequence — like a pen
 * tracing each letterform left to right — before the ink "fills in".
 *
 * Each letter gets its own <path> (rather than one path for the whole
 * word) because SVG resets stroke-dasharray/dashoffset at every subpath
 * boundary; a glyph-outline path for a whole word is a compound path with
 * one subpath per letter, so a single dasharray spanning the whole thing
 * doesn't reveal it letter-by-letter — every subpath just pops in together.
 *
 * Falls back to plain text if the font can't be loaded/parsed, or if the
 * user prefers reduced motion (in which case it renders fully drawn/filled
 * immediately, no animation).
 */
export default function SignatureTrace({ text, className = '' }) {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, '')
  const gradientId = `sig-grad-${rawId}`
  const containerRef = useRef(null)
  const groupRef = useRef(null)
  const [glyphData, setGlyphData] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let cancelled = false
    loadSignatureFont()
      .then((font) => {
        if (cancelled) return
        const unitsPerEm = font.unitsPerEm
        const combined = font.getPath(text, 0, 0, unitsPerEm)
        const bbox = combined.getBoundingBox()
        // toPathData()'s flipY option (on by default) assumes the raw path
        // is in y-up font-design space and mirrors it for SVG's y-down
        // convention. Empirically, for this font/opentype.js version the raw
        // path is already SVG-ready — flipping it a second time scrambled
        // every glyph (confirmed by comparing against opentype.js's own
        // canvas font.draw() as ground truth, which needs no flip either).
        const paths = font
          .getPaths(text, 0, 0, unitsPerEm)
          .map((p) => p.toPathData({ decimalPlaces: 1, flipY: false }))
          .filter((d) => d && d.length > 0)

        const cx = (bbox.x1 + bbox.x2) / 2
        const cy = (bbox.y1 + bbox.y2) / 2
        const halfDx = (GRADIENT_DX * (bbox.x2 - bbox.x1)) / 2
        const halfDy = (GRADIENT_DY * (bbox.y2 - bbox.y1)) / 2

        setGlyphData({
          paths,
          viewBox: `${bbox.x1} ${bbox.y1} ${bbox.x2 - bbox.x1} ${bbox.y2 - bbox.y1}`,
          aspect: (bbox.x2 - bbox.x1) / (bbox.y2 - bbox.y1),
          strokeWidth: unitsPerEm * STROKE_FRACTION_OF_EM,
          gradient: { x1: cx - halfDx, y1: cy - halfDy, x2: cx + halfDx, y2: cy + halfDy },
        })
      })
      .catch(() => {
        // Leave glyphData null — the component falls back to plain text below.
      })
    return () => {
      cancelled = true
    }
  }, [text])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.4 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!visible || !glyphData) return
    const group = groupRef.current
    if (!group) return
    const letterPaths = Array.from(group.querySelectorAll('path'))
    if (!letterPaths.length) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      letterPaths.forEach((p) => {
        p.style.strokeDasharray = 'none'
        p.style.strokeOpacity = '1'
        p.style.fillOpacity = '1'
      })
      return
    }

    const lengths = letterPaths.map((p) => p.getTotalLength())
    const totalLength = lengths.reduce((a, b) => a + b, 0) || 1
    const totalDrawMs = Math.min(3200, Math.max(900, totalLength * 2.2))

    const animations = []
    let elapsed = 0
    letterPaths.forEach((p, i) => {
      const length = lengths[i] || 0.01
      const strokeDuration = Math.max(60, totalDrawMs * (length / totalLength))
      p.style.strokeDasharray = String(length)
      p.style.strokeDashoffset = String(length)
      p.style.strokeOpacity = '1'
      p.style.fillOpacity = '0'
      animations.push(
        p.animate(
          [{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
          { duration: strokeDuration, delay: elapsed, easing: 'ease-in-out', fill: 'forwards' },
        ),
      )

      // Fill this letter in as its own stroke finishes (with a slight
      // overlap so the ink feels like it's catching up to the pen, rather
      // than a fill pass that only starts once every letter is done).
      const fillDuration = Math.min(420, Math.max(140, strokeDuration * 0.7))
      const fillDelay = Math.max(0, elapsed + strokeDuration - fillDuration * 0.25)
      animations.push(
        p.animate(
          [{ fillOpacity: 0 }, { fillOpacity: 1 }],
          { duration: fillDuration, delay: fillDelay, easing: 'ease-out', fill: 'forwards' },
        ),
      )

      elapsed += strokeDuration
    })

    return () => animations.forEach((a) => a.cancel())
  }, [visible, glyphData])

  return (
    <span ref={containerRef} className={className}>
      {glyphData ? (
        <svg
          viewBox={glyphData.viewBox}
          style={{ height: '1em', width: `${glyphData.aspect}em`, overflow: 'visible' }}
        >
          <defs>
            {/* userSpaceOnUse (rather than the default objectBoundingBox) so
                every letter's <path> samples the SAME gradient spanning the
                whole word, instead of each letter re-running white-to-gold
                across just its own small bounding box. */}
            <linearGradient
              id={gradientId}
              gradientUnits="userSpaceOnUse"
              x1={glyphData.gradient.x1}
              y1={glyphData.gradient.y1}
              x2={glyphData.gradient.x2}
              y2={glyphData.gradient.y2}
            >
              <stop offset="0%" style={{ stopColor: '#fff' }} />
              <stop offset="55%" style={{ stopColor: 'var(--accent-bright)' }} />
              <stop offset="100%" style={{ stopColor: 'var(--accent)' }} />
            </linearGradient>
          </defs>
          <g ref={groupRef}>
            {glyphData.paths.map((d, i) => (
              <path
                key={i}
                d={d}
                fill={`url(#${gradientId})`}
                fillOpacity="0"
                stroke={`url(#${gradientId})`}
                strokeOpacity="0"
                strokeWidth={glyphData.strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </g>
        </svg>
      ) : (
        text
      )}
    </span>
  )
}
