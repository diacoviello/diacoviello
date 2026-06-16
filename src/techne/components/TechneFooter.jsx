import { Link } from 'react-router-dom'
import { profile, social } from '../data.js'
import SocialIcons from './SocialIcons.jsx'

export default function TechneFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="tfooter">
      <div className="tfooter__inner">
        <div className="tfooter__brand">
          <span className="tfooter__mark">{'</>'}</span>
          <div>
            <strong>{profile.name}</strong>
            <p>Full-Stack Developer · Musician · Educator</p>
          </div>
        </div>

        <nav className="tfooter__nav" aria-label="Footer">
          <Link to="/techne/about">About</Link>
          <Link to="/techne/education">Education</Link>
          <Link to="/techne/experience">Experience</Link>
          <Link to="/techne/projects">Projects</Link>
          <a href={profile.resumeUrl} target="_blank" rel="noreferrer noopener">
            Resume
          </a>
          <Link to="/lamusica">La Música</Link>
        </nav>

        <div className="tfooter__right">
          <SocialIcons items={social} />
          <Link to="/" className="tfooter__home">
            ← Back to landing
          </Link>
        </div>
      </div>
      <p className="tfooter__legal">© {year} David Iacoviello. All rights reserved.</p>
    </footer>
  )
}
