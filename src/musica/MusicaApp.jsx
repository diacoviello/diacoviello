import { Routes, Route, Navigate } from 'react-router-dom'
import MusicaNav from './components/MusicaNav.jsx'
import MusicaFooter from './components/MusicaFooter.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Education from './pages/Education.jsx'
import Background from './pages/Background.jsx'
import Experience from './pages/Experience.jsx'
import Resources from './pages/Resources.jsx'
import './MusicaApp.css'

export default function MusicaApp() {
  return (
    <div className="musica">
      <div className="musica-bg" aria-hidden="true">
        <span className="musica-bg__staff" />
        <span className="musica-bg__glow musica-bg__glow--gold" />
        <span className="musica-bg__glow musica-bg__glow--cyan" />
      </div>

      <MusicaNav />

      <main className="musica-main">
        <Routes>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="education" element={<Education />} />
          <Route path="background" element={<Background />} />
          <Route path="experience" element={<Experience />} />
          <Route path="resources" element={<Resources />} />
          <Route path="*" element={<Navigate to="/lamusica" replace />} />
        </Routes>
      </main>

      <MusicaFooter />
    </div>
  )
}
