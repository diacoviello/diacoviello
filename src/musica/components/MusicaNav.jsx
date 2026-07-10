import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import './MusicaNav.css'

const logo = '/images/diablo-symbol.png'

const NAV = [
  { label: 'Home', to: '/lamusica' },
  { label: 'About', to: '/lamusica/about' },
  { label: 'Education', to: '/lamusica/education' },
  { label: 'Background', to: '/lamusica/background' },
  {
    label: 'Experience',
    to: '/lamusica/experience',
    children: [
      { label: 'Music Education', to: '/lamusica/experience#music-education' },
      {
        label: 'Marching Band Design / Instruction',
        to: '/lamusica/experience#marching-band',
      },
      { label: 'Lessons', to: '/lamusica/experience#lessons' },
      { label: 'Performances', to: '/lamusica/experience#performances' },
      { label: 'Service', to: '/lamusica/experience#service' },
    ],
  },
  {
    label: 'Resources',
    to: '/lamusica/resources',
    children: [
      { label: 'Drill Design Examples', to: '/lamusica/resources#drill-design' },
      { label: 'Performances', to: '/lamusica/resources#performances' },
    ],
  },
]

export default function MusicaNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false) // mobile drawer
  const [openGroup, setOpenGroup] = useState(null) // mobile accordion
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile drawer whenever the route (or hash) changes.
  useEffect(() => {
    setOpen(false)
    setOpenGroup(null)
  }, [location.pathname, location.hash])

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className={`mnav ${scrolled ? 'is-scrolled' : ''}`}>
      <nav className="mnav__inner">
        <Link to="/lamusica" className="mnav__brand" aria-label="La Música — home">
          <img src={logo} alt="" className="mnav__logo" />
          <span className="mnav__brand-text">
            La&nbsp;Música
            <small>David Iacoviello</small>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="mnav__links">
          {NAV.map((item) => (
            <li
              key={item.label}
              className={item.children ? 'mnav__item has-menu' : 'mnav__item'}
            >
              <NavLink
                to={item.to}
                end={item.to === '/lamusica'}
                className={({ isActive }) =>
                  `mnav__link ${isActive ? 'is-active' : ''}`
                }
              >
                {item.label}
                {item.children && <span className="mnav__caret" aria-hidden="true" />}
              </NavLink>

              {item.children && (
                <ul className="mnav__dropdown">
                  {item.children.map((child) => (
                    <li key={child.label}>
                      <Link to={child.to} className="mnav__drop-link">
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* Cross-link to the developer side */}
        <Link to="/techne" className="mnav__cross" title="Cross to the developer side">
          Techné →
        </Link>

        {/* Mobile toggle */}
        <button
          className={`mnav__burger ${open ? 'is-open' : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`mnav__drawer ${open ? 'is-open' : ''}`}>
        <ul className="mnav__drawer-list">
          {NAV.map((item) => (
            <li key={item.label}>
              {item.children ? (
                <>
                  <button
                    className="mnav__drawer-group"
                    onClick={() =>
                      setOpenGroup((g) => (g === item.label ? null : item.label))
                    }
                    aria-expanded={openGroup === item.label}
                  >
                    {item.label}
                    <span
                      className={`mnav__caret ${
                        openGroup === item.label ? 'is-up' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  <ul
                    className={`mnav__drawer-sub ${
                      openGroup === item.label ? 'is-open' : ''
                    }`}
                  >
                    <li>
                      <Link to={item.to} className="mnav__drawer-sublink">
                        All {item.label}
                      </Link>
                    </li>
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <Link to={child.to} className="mnav__drawer-sublink">
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <NavLink
                  to={item.to}
                  end={item.to === '/lamusica'}
                  className={({ isActive }) =>
                    `mnav__drawer-link ${isActive ? 'is-active' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              )}
            </li>
          ))}
          <li>
            <Link to="/techne" className="mnav__drawer-link mnav__drawer-link--cross">
              Cross to Techné →
            </Link>
          </li>
        </ul>
      </div>
      {open && (
        <button
          className="mnav__scrim"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}
    </header>
  )
}
