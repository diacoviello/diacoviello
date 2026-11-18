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
  /* Phones: v1 stacks the box above him, over the page text. Put it beside him as on desktop
     (same offsets as v1's 640px+ layout), filling the gap between him and the left edge. The
     message is sized from the box width (cqi) so its three lines fit without rewrapping.
     The box is centred on his height: its bottom sits at his middle (the sprite is 192x208, so
     half his height is width*.5417) and transform pulls it down by half its own height. This uses
     transform, not translate, because v1 animates translate when the box opens. The pull is capped
     at that same bottom offset so a box taller than him (when minimized) stops at the screen edge. */
  @media (max-width: 639px) {
    .bubble {
      --edges: calc(max(var(--gutter), env(safe-area-inset-left,0px)) + max(var(--gutter), env(safe-area-inset-right,0px)));
      right: calc(var(--width)*.83); bottom: calc(var(--width)*.5417);
      transform: translateY(min(50%, var(--width)*.5417));
      width: min(333px, calc(100vw - var(--edges) - var(--width)*.83));
      padding: 8px 10px; container-type: inline-size;
    }
    /* Minimized he shrinks to .6 from his bottom edge, so his middle drops to width*.325. */
    :host([data-minimized]) .bubble {
      right: calc(var(--width)*.51); bottom: calc(var(--width)*.325);
      transform: translateY(min(50%, var(--width)*.325));
      width: min(333px, calc(100vw - var(--edges) - var(--width)*.51));
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
export default function Reaper() {
  const ref = useRef(null)

  useEffect(() => {
    let observer
    let cancelled = false
    customElements.whenDefined('saas-is-dead').then(() => {
      const root = ref.current?.shadowRoot
      const visit = root?.querySelector('.visit')
      const credit = root?.querySelector('.credit')
      const icon = credit?.querySelector('img')
      if (cancelled || !visit || !icon) return

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
    })
    return () => {
      cancelled = true
      observer?.disconnect()
    }
  }, [])

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
