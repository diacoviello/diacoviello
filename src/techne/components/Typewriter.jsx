import { useEffect, useRef, useState } from 'react'

/**
 * Types each word out, pauses, deletes, and moves to the next — looping.
 * Honours prefers-reduced-motion by showing the first word statically.
 */
export default function Typewriter({
  words,
  typeSpeed = 90,
  deleteSpeed = 45,
  pause = 1500,
}) {
  const reduce = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [text, setText] = useState(reduce.current ? words[0] : '')
  const [wordIdx, setWordIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (reduce.current) return
    const current = words[wordIdx % words.length]
    let t

    if (!deleting && text === current) {
      t = setTimeout(() => setDeleting(true), pause)
    } else if (deleting && text === '') {
      setDeleting(false)
      setWordIdx((i) => (i + 1) % words.length)
    } else {
      t = setTimeout(
        () => {
          setText((prev) =>
            deleting
              ? current.slice(0, prev.length - 1)
              : current.slice(0, prev.length + 1),
          )
        },
        deleting ? deleteSpeed : typeSpeed,
      )
    }
    return () => clearTimeout(t)
  }, [text, deleting, wordIdx, words, typeSpeed, deleteSpeed, pause])

  return (
    <span className="tw">
      {text}
      <span className="tw__caret" aria-hidden="true" />
    </span>
  )
}
