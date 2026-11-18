import { useEffect, useRef } from 'react'
import jamScript from '../../../reaper/reaper-custom/reaper-jam.js?url'
import jamSheet from '../../../reaper/reaper-custom/reaper-jam-sheet.webp'

// v1 remembers a dismissal for 14 days. Forget it on each page load so a refresh replays
// the whole intro; closing him still holds while moving around the site without reloading.
try {
  localStorage.removeItem('saasisdead_reaper_v1_dismissed')
} catch {
  // Storage is blocked, so there is nothing to clear.
}

const overrides = `
  .bubble { width: min(333px, calc(100vw - 2*var(--gutter) - env(safe-area-inset-right,0px))); padding: 10px 12px; }
  .message { margin: 0; padding-right: 18px; font-size: 14px; white-space: pre-line; }
  .description { margin-top: 4px; font-size: 11px; line-height: 1.4; }
  .visit { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 8px; padding: 6px 10px; }
  .visit img { width: 18px; height: 18px; object-fit: contain; }
  :host(:not([data-dark])) .visit img { filter: invert(1) hue-rotate(180deg); }
  .dismiss { right: 0; top: 0; width: 28px; height: 28px; padding: 8px; }
  .dismiss svg { width: 12px; height: 12px; }
  /* The box is see-through on purpose (TechneApp.css). Blur what shows through so page text doesn't read under it. */
  .bubble { -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); }
  /* He always shows at his minimized size, so closing the box doesn't shrink him: v1 scales the
     character to .6 only once minimized, and the jam script shortens his stroll by the same --rm-k.
     The :not() outranks the jam script's plain :host { --rm-k: 1 }. The box takes the minimized
     offsets in every state too, below and in the phone block. */
  .character { transform: scale(.6); }
  :host(:not([data-rm-k-full])) { --rm-k: .6; }
  @media (min-width: 640px) {
    .bubble { right: calc(var(--width)*.51); bottom: calc(var(--width)*.3); }
  }
  /* Hide-Reaper button, added below. It sits on the top-right corner of his scaled sprite
     (.6 from the bottom-right, sprite 192x208, so his top is width*.4333 down) and lives in
     .arrival so it strolls with him. Shown only once the box has been closed: on hover or
     keyboard focus with a mouse, and always (dimmed) on touch screens, which can't hover. */
  .arrival { position: relative; }
  .rk-hide {
    position: absolute; z-index: 3; right: -6px; top: calc(var(--width)*.4333 - 8px);
    display: grid; place-items: center; width: 24px; height: 24px; padding: 0;
    border: 1px solid var(--border); border-radius: 50%; background: var(--bg); color: var(--muted);
    pointer-events: auto; opacity: 0; visibility: hidden; transition: opacity 150ms, visibility 150ms;
  }
  .rk-hide::before { content: ""; position: absolute; inset: -10px; }
  .rk-hide svg { display: block; width: 12px; height: 12px; }
  .rk-hide:hover { color: var(--fg); }
  .rk-hide:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  :host([data-minimized]) .cameo:hover .rk-hide,
  :host([data-minimized]) .rk-hide:focus-visible { opacity: 1; visibility: visible; }
  @media (hover: none) {
    :host([data-minimized]) .rk-hide { opacity: .75; visibility: visible; }
  }
  /* Leaving: wave (v1's own "wave" phase), then walk off the right edge. "leave" is not
     "idle", so the jam script stops its moves and music. Row 1 of v1's sheet is his walk to
     the right (the jam script's stroll home uses it). At .6 scale he covers about .6 of v1's
     walk-in distance per step, so .6*width + gutter takes about 17 steps of 90ms. */
  :host([data-leaving]) .bubble, :host([data-leaving]) .rk-hide { opacity: 0 !important; visibility: hidden !important; }
  :host([data-phase="leave"]) .sprite { background-position-y: 10%; animation: walk 720ms steps(8,end) infinite; }
  :host([data-phase="leave"]) .arrival { animation: rk-leave 1530ms linear both; }
  @keyframes rk-leave {
    to { transform: translateX(calc(var(--width)*.6 + max(var(--gutter), env(safe-area-inset-right,0px)) + 6px)); }
  }
  /* Phones: v1 stacks the box above him, over the page text. Put it beside him as on desktop,
     filling the gap between him and the left edge. The message is sized from the box width (cqi)
     so its three lines fit without rewrapping.
     The box is centred on his height: its bottom sits at his middle (the sprite is 192x208 and
     scaled .6 from its bottom edge, so that's width*.325) and transform pulls it down by half its
     own height. This uses transform, not translate, because v1 animates translate when the box
     opens. The pull is capped at that same offset so a box taller than him stops at the screen edge.
     Both selectors, because v1's :host([data-minimized]) .bubble outranks a bare .bubble. */
  @media (max-width: 639px) {
    .bubble, :host([data-minimized]) .bubble {
      --edges: calc(max(var(--gutter), env(safe-area-inset-left,0px)) + max(var(--gutter), env(safe-area-inset-right,0px)));
      right: calc(var(--width)*.51); bottom: calc(var(--width)*.325);
      transform: translateY(min(50%, var(--width)*.325));
      width: min(333px, calc(100vw - var(--edges) - var(--width)*.51));
      padding: 8px 10px; container-type: inline-size;
    }
    .bubble::after { right: -6px; top: calc(50% - 5px); bottom: auto; border-bottom: 0; border-top: 1px solid var(--border); }
    /* The longest line is about 18px wide per px of font; the 16px clears the close button. */
    .message { padding-right: 16px; font-size: clamp(10px, calc((100cqi - 16px) / 19), 14px); }
    .description { display: none; }
    .visit { margin-top: 6px; padding: 4px 8px; font-size: 11px; }
    .visit img { width: 14px; height: 14px; }
  }
`

// The script is hosted by saasisdead.si, so its markup can only be changed from
// outside. If its internals change, the guard below leaves the stock box in place.
const WAVE_MS = 840 // v1's wave phase
const LEAVE_MS = 1530 // rk-leave above

// gone: the visitor has hidden him (TechneApp keeps this for the session).
// onDismiss: called once he has walked off after the visitor pressed his ✕.
export default function Reaper({ gone = false, onDismiss }) {
  const ref = useRef(null)
  const onDismissRef = useRef(onDismiss)
  const wasGone = useRef(gone)

  useEffect(() => {
    onDismissRef.current = onDismiss
  }, [onDismiss])

  useEffect(() => {
    let observer
    let cancelled = false
    const timers = []
    customElements.whenDefined('saas-is-dead').then(() => {
      const host = ref.current
      const root = host?.shadowRoot
      const visit = root?.querySelector('.visit')
      const credit = root?.querySelector('.credit')
      const icon = credit?.querySelector('img')
      const arrival = root?.querySelector('.arrival')
      if (cancelled || !visit || !icon || !arrival) return

      const style = document.createElement('style')
      style.textContent = overrides
      root.append(style)
      credit.remove()

      const fill = () => {
        if (visit.firstChild !== icon) visit.replaceChildren(icon, 'SaaS is dead')
      }
      fill()
      // The script rewrites the button text whenever the theme changes.
      observer = new MutationObserver(fill)
      observer.observe(visit, { childList: true })

      const hide = document.createElement('button')
      hide.type = 'button'
      hide.className = 'rk-hide'
      hide.setAttribute('aria-label', 'Hide Reaper')
      hide.title = 'Hide Reaper'
      hide.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>'
      arrival.append(hide)
      hide.addEventListener('click', () => {
        if (host.hasAttribute('data-leaving')) return
        host.setAttribute('data-leaving', '')
        const done = () => onDismissRef.current?.()
        const still =
          matchMedia('(prefers-reduced-motion: reduce)').matches || host.hasAttribute('data-fallback')
        if (still) return done()
        host.setAttribute('data-phase', 'wave')
        timers.push(
          setTimeout(() => {
            host.setAttribute('data-phase', 'leave')
            timers.push(setTimeout(done, LEAVE_MS))
          }, WAVE_MS),
        )
      })
    })
    return () => {
      cancelled = true
      observer?.disconnect()
      timers.forEach(clearTimeout)
    }
  }, [])

  // Hidden for the session, or brought back from the footer: v1's replay() walks him in again
  // with his intro message.
  useEffect(() => {
    const host = ref.current
    if (!host) return
    host.toggleAttribute('hidden', gone)
    if (!gone && wasGone.current) {
      host.removeAttribute('data-leaving')
      host.replay?.()
    }
    wasGone.current = gone
  }, [gone])

  return (
    <>
      <saas-is-dead
        ref={ref}
        story="support"
        message="Companies give people&#39;s jobs to AI.&#10;People recreate their products&#10;using the same AI. Natural Balance."
        /* message="If they're going to use AI to take our jobs, we'll can use AI to take theirs too!" */
        size="small"
        position="right"
        theme="auto"
      >
        <a href="https://saasisdead.si/" target="_blank" rel="noopener">SaaS is dead</a>
      </saas-is-dead>
      <script src="https://saasisdead.si/reaper/v1.js" async crossOrigin="anonymous" />
      {/* A classic script, not an import: it reads its options from document.currentScript. */}
      <script
        src={jamScript}
        data-sheet={jamSheet}
        data-moves="glance,hop,wink,content,lookaround,ponder,research,doze"
        data-moves-every="8"
        async
      />
    </>
  )
}
