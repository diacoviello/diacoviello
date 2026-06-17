import { Link } from 'react-router-dom'
import LandingCanvas from './LandingCanvas.jsx'
import './Landing.css'

// Lives in /public, so reference it by its served URL (don't import public assets).
const logo = '/images/diablo-symbol.png'

export default function Landing() {
  return (
    <div className="landing">
      <LandingCanvas />
      <div className="landing-vignette" aria-hidden="true" />

      <main className="landing-stage">
        <p className="landing-hint">Welcome to the homepage for</p>
        <p className="landing-eyebrow">David&nbsp;Iacoviello</p>

        <div className="logo-split">
          <span className="logo-halo" aria-hidden="true" />

          <Link
            to="/lamusica"
            className="half half-left"
            aria-label="Enter La Música — professional musician and drill designer"
          >
            <img className="half-img" src={logo} alt="" draggable="false" />
          </Link>

          <Link
            to="/techne"
            className="half half-right"
            aria-label="Enter Techné — software developer portfolio"
          >
            <img className="half-img" src={logo} alt="" draggable="false" />
          </Link>

          <span className="side-label side-label--left" aria-hidden="true">
            <span className="side-label__title">La&nbsp;Música</span>
            <span className="side-label__sub">Musician · Drill Designer</span>
          </span>
          <span className="side-label side-label--right" aria-hidden="true">
            <span className="side-label__title">Techné</span>
            <span className="side-label__sub">Software Developer</span>
          </span>
        </div>

        <p className="landing-hint">Which half would you like to explore?</p>
      </main>
    </div>
  )
}
