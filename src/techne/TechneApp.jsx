import { useCallback, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import TechneNav from './components/TechneNav.jsx'
import TechneFooter from './components/TechneFooter.jsx'
import Reaper from './components/Reaper.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Education from './pages/Education.jsx'
import Experience from './pages/Experience.jsx'
import Projects from './pages/Projects.jsx'
import Contact from './pages/Contact.jsx'
import './TechneApp.css'

// Hiding the Reaper lasts until the tab closes; the footer link brings him back sooner.
const REAPER_KEY = 'techne-reaper-hidden'

function readReaperHidden() {
  try {
    return sessionStorage.getItem(REAPER_KEY) === '1'
  } catch {
    return false
  }
}

function saveReaperHidden(hidden) {
  try {
    if (hidden) sessionStorage.setItem(REAPER_KEY, '1')
    else sessionStorage.removeItem(REAPER_KEY)
  } catch {
    // Storage is blocked: he stays hidden or back for this page view only.
  }
}

export default function TechneApp() {
  const [reaperHidden, setReaperHidden] = useState(readReaperHidden)
  const setReaper = useCallback((hidden) => {
    saveReaperHidden(hidden)
    setReaperHidden(hidden)
  }, [])

  return (
    <div className="techne">
      <div className="techne-bg" aria-hidden="true">
        <span className="techne-bg__grid" />
        <span className="techne-bg__glow techne-bg__glow--cyan" />
        <span className="techne-bg__glow techne-bg__glow--green" />
      </div>

      <TechneNav />

      <main className="techne-main">
        <Routes>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="education" element={<Education />} />
          <Route path="experience" element={<Experience />} />
          <Route path="projects" element={<Projects />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/techne" replace />} />
        </Routes>
      </main>

      <TechneFooter reaperHidden={reaperHidden} onBringBackReaper={() => setReaper(false)} />

      <Reaper gone={reaperHidden} onDismiss={() => setReaper(true)} />
    </div>
  )
}
