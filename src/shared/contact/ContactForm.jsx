import { useCallback, useEffect, useId, useRef, useState } from 'react'
import './ContactForm.css'

// Turnstile site keys are public. In dev, fall back to Cloudflare's
// always-pass test key (pairs with the test secret in .dev.vars.example).
const TURNSTILE_SITE_KEY =
  import.meta.env.VITE_TURNSTILE_SITE_KEY ||
  (import.meta.env.DEV ? '1x00000000000000000000AA' : '')
const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

const MESSAGE_MAX = 5000

let turnstileScript
function loadTurnstile() {
  turnstileScript ??= new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = TURNSTILE_SRC
    script.async = true
    script.onload = () => resolve(window.turnstile)
    script.onerror = () => {
      turnstileScript = null
      reject(new Error('Failed to load Turnstile'))
    }
    document.head.appendChild(script)
  })
  return turnstileScript
}

/** Renders a Turnstile widget into `ref` and tracks its current token. */
function useTurnstile() {
  const ref = useRef(null)
  const widgetId = useRef(null)
  const [token, setToken] = useState('')

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) {
      console.error('VITE_TURNSTILE_SITE_KEY is not set — the contact form cannot verify visitors.')
      return
    }
    let cancelled = false
    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !ref.current) return
        widgetId.current = turnstile.render(ref.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: 'dark',
          callback: setToken,
          'expired-callback': () => setToken(''),
          'error-callback': () => setToken(''),
        })
      })
      .catch((err) => console.error(err))

    return () => {
      cancelled = true
      if (widgetId.current != null) window.turnstile?.remove(widgetId.current)
      widgetId.current = null
    }
  }, [])

  // Tokens are single-use, so get a fresh one after every submit attempt.
  const reset = useCallback(() => {
    setToken('')
    if (widgetId.current != null) window.turnstile?.reset(widgetId.current)
  }, [])

  return { ref, token, reset }
}

/**
 * Contact form shared by both halves of the site. Colours come from the
 * --accent* variables, so it renders gold under .musica and cyan under .techne.
 *
 * @param {'musica'|'techne'} site  which half sent the message (shown in the email)
 * @param {string[]} topics  options for the "What's this about?" select
 */
export default function ContactForm({ site, topics }) {
  const id = useId()
  const empty = { name: '', email: '', topic: topics[0], message: '', company: '' }
  const [values, setValues] = useState(empty)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')
  const { ref: turnstileRef, token, reset: resetTurnstile } = useTurnstile()

  const update = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    if (!token) {
      setStatus('error')
      setError('Please complete the verification check below.')
      return
    }

    setStatus('sending')
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, site, turnstileToken: token }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
      setStatus('sent')
      setValues(empty)
    } catch (err) {
      setStatus('error')
      setError(
        err instanceof TypeError
          ? 'Network error. Please check your connection and try again.'
          : err.message,
      )
    } finally {
      resetTurnstile()
    }
  }

  const sending = status === 'sending'

  return (
    <form className="cform" onSubmit={handleSubmit}>
      <div className="cform__row">
        <label className="cform__field" htmlFor={`${id}-name`}>
          <span>Name</span>
          <input
            id={`${id}-name`}
            name="name"
            autoComplete="name"
            required
            maxLength={100}
            value={values.name}
            onChange={update('name')}
          />
        </label>
        <label className="cform__field" htmlFor={`${id}-email`}>
          <span>Email</span>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            value={values.email}
            onChange={update('email')}
          />
        </label>
      </div>

      <label className="cform__field" htmlFor={`${id}-topic`}>
        <span>What&rsquo;s this about?</span>
        <select
          id={`${id}-topic`}
          name="topic"
          value={values.topic}
          onChange={update('topic')}
        >
          {topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <label className="cform__field" htmlFor={`${id}-message`}>
        <span>Message</span>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={7}
          required
          maxLength={MESSAGE_MAX}
          value={values.message}
          onChange={update('message')}
        />
        <small className="cform__count">
          {values.message.length} / {MESSAGE_MAX}
        </small>
      </label>

      {/* Honeypot: hidden from people, irresistible to bots. */}
      <div className="cform__hp" aria-hidden="true">
        <label>
          Company
          <input
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={values.company}
            onChange={update('company')}
          />
        </label>
      </div>

      <div className="cform__turnstile" ref={turnstileRef} />

      <div className="cform__actions">
        <button type="submit" className="m-btn m-btn--primary" disabled={sending}>
          {sending ? 'Sending…' : 'Send message'}
        </button>

        <p
          className={`cform__status ${status === 'error' ? 'is-error' : ''}`}
          role="status"
          aria-live="polite"
        >
          {status === 'sent' && 'Thanks! Your message is on its way. I’ll get back to you soon.'}
          {status === 'error' && error}
        </p>
      </div>
    </form>
  )
}
