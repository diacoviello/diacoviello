import { Link } from 'react-router-dom'
import { useRef, useState } from 'react'
import '/src/index.css'
import LandingCanvas from './LandingCanvas.jsx'
import './Landing.css'

// Live in /public, so reference by served URL (don't import public assets).
const base = '/images/diablo-symbol.png'
const yinFace = '/images/diablo-1126-yin.png' // black half
const yangFace = '/images/diablo-1126-yang.png' // white half

// Wall slices per half: opaque copies of the half's shape, each with its own --t
// (0 = resting spot, 1 = popped position). Their union reads as one extruded surface.
const WALL_STEPS = 80
const wallTs = Array.from({ length: WALL_STEPS }, (_, i) => (i / WALL_STEPS).toFixed(4))

// SVG has no z-index; paint order is DOM order. Keep the popped half on top so the
// other half collapsing underneath never paints over it. The *other* half is moved,
// never the popped one, so its :hover and running transition aren't disturbed.
function raise(half) {
  if (!half) return
  for (const other of half.parentNode.querySelectorAll(':scope > .half')) {
    if (other !== half) half.parentNode.insertBefore(other, half)
  }
}
const raiseSelf = (event) => raise(event.currentTarget)
// The hint words and arrows pop their half too (Landing.css); raise it the same way.
const raiseFromHint = (event) => {
  const side = event.currentTarget.classList.contains('landing-hint__trigger--left') ? 'left' : 'right'
  raise(event.currentTarget.closest('.landing-stage')?.querySelector(`.yinyang > .half-${side}`))
}

// One clickable half. The moving pieces ignore the pointer; only the stationary .hit
// shape (which matches the base image) decides hover, so a popped half can't steal the
// other half's hover.
function Half({ to, label, side, tone, armed, onPointerDown, onPointerUp, onClick }) {
  const shape = `#yy-${tone}-half`
  return (
    <Link
      to={to}
      className={`half half-${side} ${tone}${armed ? ' is-armed' : ''}`}
      aria-label={label}
      data-side={side}
      onPointerEnter={raiseSelf}
      onFocus={raiseSelf}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onClick={onClick}
    >
      {wallTs.map((t) => (
        <use key={t} href={shape} className="wall" style={{ '--t': t }} />
      ))}
      <use href={`#yy-${tone}-face`} className="pop" style={{ '--t': 1 }} />
      <use href={shape} className="hit" />
    </Link>
  )
}

const isTouch = (event) => event.pointerType === 'touch' || event.pointerType === 'pen'

export default function Landing() {
  const logoRef = useRef(null)

  // Touch opens a half in two taps: the first pops it ("armed", held by .is-armed in
  // Landing.css), a second tap on the same half opens it. Mouse, trackpad and keyboard
  // open on the first click. Decided per tap, so touch laptops work either way.
  // Arming happens on finger lift, not on click: iOS Safari can swallow the first click
  // when a tap reveals hover content, which would otherwise make it three taps.
  const [armed, setArmed] = useState(null)
  const tap = useRef({ touch: false, wasArmed: false })

  const armOnTouch = (event) => {
    if (isTouch(event)) setArmed(event.currentTarget.dataset.side)
  }
  const onHalfPointerDown = (event) => {
    tap.current = { touch: isTouch(event), wasArmed: armed === event.currentTarget.dataset.side }
  }
  const onHalfClick = (event) => {
    const { touch, wasArmed } = tap.current
    tap.current = { touch: false, wasArmed: false }
    if (touch && !wasArmed) event.preventDefault() // first tap: just pop it
  }
  // A touch anywhere else lets go of the popped half.
  const disarmOutside = (event) => {
    if (!event.target.closest?.('.yinyang .half, .landing-hint__trigger')) setArmed(null)
  }
  const halfProps = { onPointerDown: onHalfPointerDown, onPointerUp: armOnTouch, onClick: onHalfClick }

  return (
    <div className="landing" onPointerDown={disarmOutside}>
      <LandingCanvas logoRef={logoRef} />
      <div className="landing-vignette" aria-hidden="true" />

      <main className="landing-stage">
        <p className="landing-eyebrow">David Iacoviello</p>

        <div className="logo-split" ref={logoRef}>
          <span className="logo-halo" aria-hidden="true" />

          {/*
            Coordinate system: the yin-yang is a circle of radius 100 centred at 0,0.
            The viewBox is exactly the base image, so the popped halves stay inside it.
            Image boxes: x = y = -centre/radius*100, width = height = imageSize/radius*100.
              base (8000px master): centre 4000, radius 1858
              halves (4980px):      centre 2490.5, radius 2416.5
          */}
          <svg
            className="yinyang"
            viewBox="-215.29 -215.29 430.57 430.57"
            role="group"
            aria-label="Diablo En Música emblem"
          >
            <defs>
              {/* Vector halves: hover detection and the extrusion wall (never the visible face). */}
              <g id="yy-black-half">
                <path d="M0,-100 A100,100 0 0 1 0,100 A50,50 0 0 1 0,0 A50,50 0 0 0 0,-100 Z" />
                <circle className="eye-dot" cx="0" cy="50" r="13" />
              </g>
              <g id="yy-white-half">
                <path d="M0,-100 A100,100 0 0 0 0,100 A50,50 0 0 1 0,0 A50,50 0 0 0 0,-100 Z" />
                <circle className="eye-dot" cx="0" cy="-50" r="13" />
              </g>
              {/* Popped faces: pre-cut artwork, shown only while popped. */}
              <g id="yy-black-face">
                <image href={yinFace} x="-103.06" y="-103.06" width="206.08" height="206.08" preserveAspectRatio="none" />
              </g>
              <g id="yy-white-face">
                <image href={yangFace} x="-103.06" y="-103.06" width="206.08" height="206.08" preserveAspectRatio="none" />
              </g>
            </defs>

            {/* Full emblem underneath, always visible. */}
            <image className="base" href={base} x="-215.29" y="-215.29" width="430.57" height="430.57" />

            {/* White half pops left into La Música, black half pops right into Techné. */}
            <Half to="/lamusica" label="Enter La Música" side="left" tone="white" armed={armed === 'left'} {...halfProps} />
            <Half to="/techne" label="Enter Techné" side="right" tone="black" armed={armed === 'right'} {...halfProps} />
          </svg>
        </div>

        <div className="landing-hint">
          <span
            className="landing-hint__side landing-hint__side--left"
            style={ { fontSize: "clamp(.05rem, 4vmin, 2rem)" } }>
            <span className="landing-hint__trigger landing-hint__trigger--left" data-side="left" onPointerEnter={raiseFromHint} onPointerUp={armOnTouch}>
              Music&nbsp;
            </span>
          </span>
          <span className="landing-hint__divider"
            style={ { transform: "scaleX(200%)", fontWeight: "108", fontSize: "clamp(.05rem, 4vmin, 2rem)" } }>
            <span
              className="landing-hint__divider-part landing-hint__divider-part--left landing-hint__trigger landing-hint__trigger--left"
              data-side="left" onPointerEnter={raiseFromHint} onPointerUp={armOnTouch}>⟸</span>
            <span className="landing-hint__divider-gap">&nbsp;</span>
            <span
              className="landing-hint__divider-part landing-hint__divider-part--right landing-hint__trigger landing-hint__trigger--right"
              data-side="right" onPointerEnter={raiseFromHint} onPointerUp={armOnTouch}>⟹</span>
            {/* ⟺ */}
          </span>
          <span
            className="landing-hint__side landing-hint__side--right"
            style={ { fontFamily: "'Apple II'", fontSize: "clamp(.05rem, 4vmin, 2rem)", fontWeight: "bolder" } }>
            <span className="landing-hint__trigger landing-hint__trigger--right" data-side="right" onPointerEnter={raiseFromHint} onPointerUp={armOnTouch}>
              Dev
            </span>
          </span>
        </div>
      </main>
    </div>
  )
}
