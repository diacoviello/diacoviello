import { Link } from 'react-router-dom'
import { useRef } from 'react'
import LandingCanvas from './LandingCanvas.jsx'
import './Landing.css'

// Live in /public, so reference by served URL (don't import public assets).
const base = '/images/diablo-2026-base.png'
const leftPop = '/images/diablo-2026-left.png'
const rightPop = '/images/diablo-2026-right.png'

export default function Landing() {
  const logoRef = useRef(null)

  return (
    <div className="landing">
      <LandingCanvas logoRef={logoRef} />
      <div className="landing-vignette" aria-hidden="true" />

      <main className="landing-stage">
        <p className="landing-eyebrow">David Iacoviello</p>

        <div className="logo-split" ref={logoRef}>
          <span className="logo-halo" aria-hidden="true" />

          {/* Full emblem underneath, always visible */}
          <img className="emblem-base" src={base} alt="Diablo En Música emblem" draggable="false" />

          {/* Pre-authored "popped" halves, each drawn at its final grown-out
              position on the same canvas. Hidden until the matching side is
              hovered, then they grow outward with an off-white glow. */}
          <img
            className="emblem-pop emblem-pop--left"
            src={leftPop}
            alt=""
            aria-hidden="true"
            draggable="false"
          />
          <img
            className="emblem-pop emblem-pop--right"
            src={rightPop}
            alt=""
            aria-hidden="true"
            draggable="false"
          />

          {/* Transparent hit areas (left = música, right = techné) */}
          <Link
            to="/lamusica"
            className="half half-left"
            aria-label="Enter La Música — professional musician and drill designer"
          />
          <Link
            to="/techne"
            className="half half-right"
            aria-label="Enter Techné — software developer portfolio"
          />

          <span className="side-label side-label--left" aria-hidden="true">
            <span className="side-label__title">La&nbsp;Música</span>
            <span className="side-label__sub">Musician · Drill Designer</span>
          </span>
          <span className="side-label side-label--right" aria-hidden="true">
            <span className="side-label__title">Techné</span>
            <span className="side-label__sub">Software Developer</span>
          </span>
        </div>

        <div className="landing-hint">
          <span className="landing-hint__side landing-hint__side--left">< span style={{ fontSize: "2.3rem" }}>←</span> Music</span>
          <span className="landing-hint__divider" style={{ fontSize: "2.3rem", transform: "scaleX(230%)", fontWeight: "900" }}>↔</span>
          <span className="landing-hint__side landing-hint__side--right">Development<span style={{  }}>→</span></span>
        </div>
      </main>
    </div>
  )
}
