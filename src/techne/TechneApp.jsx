import { Routes, Route, Navigate } from 'react-router-dom'
import TechneNav from './components/TechneNav.jsx'
import TechneFooter from './components/TechneFooter.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Education from './pages/Education.jsx'
import Experience from './pages/Experience.jsx'
import Projects from './pages/Projects.jsx'
import './TechneApp.css'

export default function TechneApp() {
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
          <Route path="*" element={<Navigate to="/techne" replace />} />
        </Routes>
      </main>

      <TechneFooter />
    </div>
  )
}
