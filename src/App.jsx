import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing/Landing.jsx'
import MusicaApp from './musica/MusicaApp.jsx'
import TechneApp from './techne/TechneApp.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/lamusica/*" element={<MusicaApp />} />
        <Route path="/techne/*" element={<TechneApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
