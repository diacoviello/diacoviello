import { Link } from 'react-router-dom'

export default function MusicaFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="mfooter">
      <div className="mfooter__inner">
        <div className="mfooter__brand">
          <span className="mfooter__mark">𝄞</span>
          <div>
            <strong>David Iacoviello</strong>
            <p>Musician · Drill Designer · Educator</p>
          </div>
        </div>

        <nav className="mfooter__nav" aria-label="Footer">
          <Link to="/lamusica/about">About</Link>
          <Link to="/lamusica/education">Education</Link>
          <Link to="/lamusica/experience">Experience</Link>
          <Link to="/lamusica/resources">Resources</Link>
          <Link to="/techne">Techné</Link>
        </nav>

        <div className="mfooter__contact">
          <a href="mailto:iacoviello.david@gmail.com">iacoviello.david@gmail.com</a>
          <Link to="/" className="mfooter__home">
            ← Back to landing
          </Link>
        </div>
      </div>
      <p className="mfooter__legal">
        © {year} David Iacoviello. All rights reserved.
      </p>
    </footer>
  )
}
