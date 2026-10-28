/* ============================================================
   Cloudflare Worker — serves the React app's static assets and
   handles the contact form (POST /api/contact).

   Only /api/* requests run this code (see `run_worker_first` in
   wrangler.jsonc); everything else is served straight from assets.

   Secrets (set with `npx wrangler secret put <NAME>`, or in
   .dev.vars for local dev — see .dev.vars.example):
     RESEND_API_KEY        Resend API key used to send the email
     TURNSTILE_SECRET_KEY  Cloudflare Turnstile secret key
     CONTACT_TO            Inbox that receives messages
   Vars (wrangler.jsonc):
     CONTACT_FROM          Sender, on a domain verified in Resend
   ============================================================ */

const SITES = { musica: 'La Música', techne: 'Techné' }
const LIMITS = { name: 100, email: 254, topic: 80, message: 5000 }
const MAX_BODY_BYTES = 20_000
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') {
        return json({ error: 'Method not allowed.' }, 405, { Allow: 'POST' })
      }
      return handleContact(request, env)
    }

    return env.ASSETS.fetch(request)
  },
}

async function handleContact(request, env) {
  if (!env.RESEND_API_KEY || !env.TURNSTILE_SECRET_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) {
    console.error('Contact form is missing configuration (secrets / vars).')
    return json({ error: 'The contact form is not configured yet.' }, 500)
  }

  if (Number(request.headers.get('Content-Length')) > MAX_BODY_BYTES) {
    return json({ error: 'Message is too large.' }, 413)
  }

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid request.' }, 400)
  }

  // Honeypot: the field is hidden from real visitors, so anything in it is a
  // bot. Report success so it doesn't retry.
  if (body.company) return json({ ok: true })

  const name = singleLine(body.name)
  const email = singleLine(body.email)
  const topic = singleLine(body.topic)
  const message = String(body.message ?? '').trim()
  const site = SITES[body.site] ?? 'diacoviello.com'

  if (!name || name.length > LIMITS.name) {
    return json({ error: 'Please enter your name.' }, 400)
  }
  if (!EMAIL_RE.test(email) || email.length > LIMITS.email) {
    return json({ error: 'Please enter a valid email address.' }, 400)
  }
  if (topic.length > LIMITS.topic) {
    return json({ error: 'Invalid topic.' }, 400)
  }
  if (!message || message.length > LIMITS.message) {
    return json({ error: `Please enter a message (up to ${LIMITS.message} characters).` }, 400)
  }

  const human = await verifyTurnstile(
    String(body.turnstileToken ?? ''),
    request.headers.get('CF-Connecting-IP'),
    env.TURNSTILE_SECRET_KEY,
  )
  if (!human) {
    return json({ error: 'Verification failed. Please try again.' }, 403)
  }

  const subject = `[${site}] ${topic || 'New message'} — from ${name}`
  const headerLines = [`From: ${name} <${email}>`, `Site: ${site}`]
  if (topic) headerLines.push(`Topic: ${topic}`)
  const text = `${headerLines.join('\n')}\n\n${message}`

  const html = `
    <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;<br>
    <strong>Site:</strong> ${escapeHtml(site)}${
      topic ? `<br><strong>Topic:</strong> ${escapeHtml(topic)}` : ''
    }</p>
    <p style="white-space:pre-wrap">${escapeHtml(message)}</p>`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: [env.CONTACT_TO],
      reply_to: email,
      subject,
      text,
      html,
    }),
  })

  if (!res.ok) {
    console.error('Resend error', res.status, await res.text())
    return json({ error: "Your message couldn't be sent. Please try again later." }, 502)
  }

  return json({ ok: true })
}

async function verifyTurnstile(token, ip, secret) {
  if (!token) return false
  const form = new FormData()
  form.append('secret', secret)
  form.append('response', token)
  if (ip) form.append('remoteip', ip)

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
    })
    const outcome = await res.json()
    return outcome.success === true
  } catch (err) {
    console.error('Turnstile verification error', err)
    return false
  }
}

/** Trim and collapse whitespace (incl. newlines) so values are safe in a subject line. */
function singleLine(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim()
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function json(data, status = 200, headers = {}) {
  return Response.json(data, { status, headers })
}
