import { useEffect, useRef, useState } from 'react'

/**
 * Reveals children with a fade/slide once they scroll into view.
 *
 * @param {('up'|'left'|'right'|'zoom')} from  direction the element travels from
 * @param {number} delay  seconds to stagger the reveal
 */
export default function Reveal({
  children,
  from = 'up',
  delay = 0,
  as: Tag = 'div',
  className = '',
  ...rest
}) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true)
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`reveal reveal--${from} ${shown ? 'is-shown' : ''} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
