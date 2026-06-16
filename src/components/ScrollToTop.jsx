import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Resets scroll position on route change. If the path includes a hash, it
 * scrolls that element into view instead (used by the Musica dropdown anchors).
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        // Defer so the target route has rendered before we scroll to it.
        requestAnimationFrame(() =>
          el.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        )
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}
