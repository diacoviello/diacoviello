import { useEffect, useRef } from 'react'

/* Glyph pools — music notation (gold) vs. code tokens (cyan/green) */
const NOTES = ['♪', '♫', '♩', '♬', '𝄞', '♭', '♯', '𝄢', '𝄪', '𝅘𝅥𝅮']
const CODE = [
  '{ }', '</>', '=>', '( )', '[ ]', '&&', '||', '::', '!=', '++',
  '01', '10', 'fn', 'const', '#', ';', '/*', '*/', '<div>', '()=>',
]

const pick = (arr) => arr[(Math.random() * arr.length) | 0]

/**
 * Full-viewport canvas behind the landing logo. Wavy "strings" of music
 * notation (gold, left) and code (cyan, right) fade in and orbit / converge
 * around the page center, echoing the brand mockup.
 */
export default function LandingCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = 0
    let h = 0
    let cx = 0
    let cy = 0
    let dpr = 1
    let raf = 0
    let start = 0
    const INTRO = 2600 // ms for the converge-in intro

    const particles = []
    const waves = []

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cx = w / 2
      cy = h / 2
      build()
    }

    function build() {
      particles.length = 0
      waves.length = 0
      const maxR = Math.hypot(w, h) / 2
      const density = (w * h) / 13000
      const count = Math.max(40, Math.min(150, Math.floor(density)))

      for (let i = 0; i < count; i++) {
        const isMusic = i % 2 === 0
        const baseR = 130 + Math.random() * (maxR * 0.98 - 130)
        particles.push({
          isMusic,
          baseR,
          angle: Math.random() * Math.PI * 2,
          // closer orbits sweep a touch faster; the two families counter-rotate
          speed:
            ((0.05 + Math.random() * 0.06) * (isMusic ? 1 : -1)) /
            (0.6 + baseR / 360),
          spin: Math.random() * Math.PI * 2,
          spinSpeed: (Math.random() - 0.5) * 0.012,
          size: 13 + Math.random() * 20,
          glyph: isMusic ? pick(NOTES) : pick(CODE),
          breathPhase: Math.random() * Math.PI * 2,
          breathAmp: 8 + Math.random() * 34,
          breathSpeed: 0.4 + Math.random() * 0.5,
          delay: Math.random() * 0.55, // staggered fade-in (fraction of intro)
          base: 0.32 + Math.random() * 0.5, // resting opacity
        })
      }

      // Background "strings" — flowing horizontal sine ribbons.
      const waveCount = w < 700 ? 4 : 6
      for (let i = 0; i < waveCount; i++) {
        waves.push({
          y: h * (0.18 + (0.64 * i) / (waveCount - 1)),
          amp: 40 + Math.random() * 80,
          len: 0.004 + Math.random() * 0.004,
          phase: Math.random() * Math.PI * 2,
          drift: (0.18 + Math.random() * 0.3) * (i % 2 ? -1 : 1),
        })
      }
    }

    function drawWave(wv, p) {
      ctx.beginPath()
      const step = 14
      for (let x = -20; x <= w + 20; x += step) {
        const t = x / w
        const y =
          wv.y +
          Math.sin(x * wv.len + wv.phase) * wv.amp * (0.5 + 0.5 * Math.sin(t * Math.PI))
        if (x === -20) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      const grad = ctx.createLinearGradient(0, 0, w, 0)
      grad.addColorStop(0, `rgba(233,189,85,${0.16 * p})`)
      grad.addColorStop(0.5, `rgba(160,170,210,${0.05 * p})`)
      grad.addColorStop(1, `rgba(79,211,196,${0.14 * p})`)
      ctx.strokeStyle = grad
      ctx.lineWidth = 1.1
      ctx.stroke()
    }

    function frame(now) {
      if (!start) start = now
      const elapsed = now - start
      const intro = Math.min(1, elapsed / INTRO)
      const tSec = elapsed / 1000

      ctx.clearRect(0, 0, w, h)
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'

      // Background ribbons
      for (const wv of waves) {
        wv.phase += wv.drift * 0.01
        drawWave(wv, intro)
      }

      // Orbiting glyph "strings"
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      for (const pt of particles) {
        // Per-particle intro envelope (delayed ease-out)
        const local = Math.max(
          0,
          Math.min(1, (intro - pt.delay) / (1 - pt.delay || 1)),
        )
        const ease = 1 - Math.pow(1 - local, 3)
        if (ease <= 0) continue

        if (!reduce) {
          pt.angle += pt.speed * 0.016
          pt.spin += pt.spinSpeed
        }

        // Converge inward during intro, then gently breathe
        const breath = reduce
          ? 0
          : Math.sin(tSec * pt.breathSpeed + pt.breathPhase) * pt.breathAmp
        const radius = pt.baseR * (1 + (1 - ease) * 0.7) + breath

        const x = cx + Math.cos(pt.angle) * radius
        const y = cy + Math.sin(pt.angle) * radius

        const alpha = pt.base * ease
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(pt.angle + Math.PI / 2 + pt.spin * 0.15)
        ctx.font = `${pt.size}px ${
          pt.isMusic ? "'Cormorant Garamond', serif" : "'JetBrains Mono', monospace"
        }`
        const color = pt.isMusic ? '233,189,85' : '79,211,196'
        ctx.shadowColor = `rgba(${color},${alpha})`
        ctx.shadowBlur = 10
        ctx.fillStyle = `rgba(${color},${alpha})`
        ctx.fillText(pt.glyph, 0, 0)
        ctx.restore()
      }

      ctx.restore()

      if (!reduce) raf = requestAnimationFrame(frame)
    }

    resize()
    if (reduce) {
      // Draw a single resting frame.
      start = performance.now() - INTRO
      frame(performance.now())
    } else {
      raf = requestAnimationFrame(frame)
    }

    let resizeTimer
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(resize, 150)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      clearTimeout(resizeTimer)
    }
  }, [])

  return <canvas ref={canvasRef} className="landing-canvas" aria-hidden="true" />
}
