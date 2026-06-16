import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { profile } from '../data.js'
import './TechneNav.css'

const logo = '/images/diablo-symbol.png'

const NAV = [
  { label: 'Home', to: '/techne' },
  { label: 'About', to: '/techne/about' },
  { label: 'Education', to: '/techne/education' },
  { label: 'Experience', to: '/techne/experience' },
  { label: 'Projects', to: '/techne/projects' },
]

export default function TechneNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className={`tnav ${scrolled ? 'is-scrolled' : ''}`}>
      <nav className="tnav__inner">
        <Link to="/techne" className="tnav__brand" aria-label="Techné — home">
          <img src={logo} alt="" className="tnav__logo" />
          <span className="tnav__brand-text">
            Techné
            <small>David Iacoviello</small>
          </span>
        </Link>

        <ul className="tnav__links">
          {NAV.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.to}
                end={item.to === '/techne'}
                className={({ isActive }) =>
                  `tnav__link ${isActive ? 'is-active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
          <li>
            <a
              href={profile.resumeUrl}
              className="tnav__link"
              target="_blank"
              rel="noreferrer noopener"
            >
              Resume ↗
            </a>
          </li>
        </ul>

        <Link to="/lamusica" className="tnav__cross" title="Cross to the music side">
          La Música →
        </Link>

        <button
          className={`tnav__burger ${open ? 'is-open' : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div className={`tnav__drawer ${open ? 'is-open' : ''}`}>
        <ul className="tnav__drawer-list">
          {NAV.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.to}
                end={item.to === '/techne'}
                className={({ isActive }) =>
                  `tnav__drawer-link ${isActive ? 'is-active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
          <li>
            <a
              href={profile.resumeUrl}
              className="tnav__drawer-link"
              target="_blank"
              rel="noreferrer noopener"
            >
              Resume ↗
            </a>
          </li>
          <li>
            <Link to="/lamusica" className="tnav__drawer-link tnav__drawer-link--cross">
              Cross to La Música →
            </Link>
          </li>
        </ul>
      </div>
      {open && (
        <button
          className="tnav__scrim"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}
    </header>
  )
}
