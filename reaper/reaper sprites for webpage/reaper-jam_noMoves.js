/*
 * reaper-jam.js — "music break" add-on for the SaaS is dead Reaper (<saas-is-dead>, v1.js).
 *
 * After the Reaper has been idle for a while, it pulls out a phone and headphones,
 * hits play, dances, and music notes float around it. Then it packs up and waits again.
 *
 * It does NOT modify v1.js or its sprite sheet. With data-sheet, the music break plays frames
 * from your own sheet; without it (or if the sheet fails to load), props are SVG drawn in an
 * overlay and the dance reuses v1's idle frames with transforms. Notes are always animated here.
 * Everything lives inside the Reaper's (open) shadow root. If v1 changes its internal class names, this add-on stops working
 * silently (nothing breaks on the page, the dance just doesn't happen).
 *
 * Usage (load after or before v1.js, order doesn't matter):
 *   <script src="https://saasisdead.si/reaper/v1.js" defer></script>
 *   <script src="/js/reaper-jam.js" data-delay="20" defer></script>
 *
 * Options (data attributes on this <script> tag):
 *   data-delay="20"    seconds of idle before the first music break
 *   data-dance="16"    seconds of dancing per break
 *   data-repeat="40"   seconds of idle between breaks; "0" = only once per page load
 *   data-bpm="120"     dance tempo (60–180)
 *   data-debug         start after 1.5s, dance forever, show alignment crosshairs
 *   data-sheet="/js/reaper-jam-sheet.webp"
 *                      play hand-drawn frames instead of the overlay props (see SHEET below);
 *                      if the sheet fails to load, the overlay version runs instead
 *
 * Prop placement (CSS on your page; custom properties pass into the shadow DOM).
 * Values are percentages of the Reaper's sprite box:
 *   saas-is-dead {
 *     --jam-head-x: 37.5%; --jam-head-y: 32%;  --jam-head-w: 45%;   headphone center + width
 *     --jam-hand-x: 24%;  --jam-hand-y: 64%;  --jam-phone-w: 15%;  phone center + width
 *   }
 *
 * JS:  ReaperJam.play()  start a break now     ReaperJam.stop()  pack up now
 */
(() => {
  "use strict";
  if (window.ReaperJam) return;

  const script = document.currentScript;
  const ds = (script && script.dataset) || {};
  const nonce = (script && script.nonce) || "";
  const num = (v, d) => (v != null && v !== "" && Number.isFinite(+v) ? +v : d);
  const debug = "debug" in ds;
  const cfg = {
    delay: debug ? 1500 : Math.max(0, num(ds.delay, 20)) * 1000,
    dance: debug ? Infinity : Math.max(2, num(ds.dance, 16)) * 1000,
    repeat: Math.max(0, num(ds.repeat, 40)) * 1000,
    bpm: Math.min(180, Math.max(60, num(ds.bpm, 120))),
  };
  const BEAT = 60000 / cfg.bpm;
  // Overlay-mode stage lengths in ms. The CSS animation timings below are built to fit these.
  const REACH = 1600; // phone pops out, headphones go on
  const TAP = 700; //    screen lights up, tap
  const PACK = 900; //   props go away

  // SHEET: 8 columns x 4 rows, frames left-aligned; any cell size works as long as it is 192:208.
  // Each row lists how long every frame is held (ms). The dance row is timed from the BPM instead.
  const SHEET = {
    reach: { row: 0, ms: [200, 220, 320, 260, 520, 320, 380, 260] }, // idle, hand down, rummage, phone out, check, headphones out, put on, ready
    tap: { row: 1, ms: [260, 420, 360] }, //                            finger, tap, listen
    dance: { row: 2, frames: 4 }, //                                     4 frames = 2 beats, loops
    pack: { row: 3, ms: [300, 240, 240, 300, 220, 220] }, //            take off, lift, lower, stash, hand down, idle
  };
  const sum = (a) => a.reduce((x, y) => x + y, 0);
  const sheetUrl = ds.sheet ? new URL(ds.sheet, document.baseURI).href : "";
  const durations = (host) =>
    host.hasAttribute("data-jam-sheet") && !host.hasAttribute("data-fallback")
      ? { reach: sum(SHEET.reach.ms), tap: sum(SHEET.tap.ms), pack: sum(SHEET.pack.ms) }
      : { reach: REACH, tap: TAP, pack: PACK };

  // Keyframes that hold each frame for its own duration (used with steps(1, end)).
  const frameKeys = (name, row, ms) => {
    const total = sum(ms);
    const pos = (i) => `${((i / 7) * 100).toFixed(4)}% ${((row / 3) * 100).toFixed(4)}%`;
    let t = 0;
    const stops = ms.map((d, i) => {
      const s = `${((t / total) * 100).toFixed(3)}% { background-position: ${pos(i)}; }`;
      t += d;
      return s;
    });
    return `@keyframes ${name} { ${stops.join(" ")} 100% { background-position: ${pos(ms.length - 1)}; } }`;
  };
  const S = ':host([data-jam-sheet]:not([data-fallback])';
  const sheetCss = `
    ${S}[data-jam]) .sprite { background-image: var(--jam-sheet); background-size: 800% 400%;
      animation-timing-function: steps(1, end); animation-iteration-count: 1; animation-fill-mode: both; }
    ${S}) .jam-prop { display: none; }
    ${S}[data-jam="reach"]) .sprite { animation-name: rjam-s-reach; animation-duration: ${sum(SHEET.reach.ms)}ms; }
    ${S}[data-jam="tap"]) .sprite { animation-name: rjam-s-tap; animation-duration: ${sum(SHEET.tap.ms)}ms; }
    ${S}[data-jam="pack"]) .sprite { animation-name: rjam-s-pack; animation-duration: ${sum(SHEET.pack.ms)}ms; }
    ${S}[data-jam="dance"]) .sprite {
      animation-name: rjam-s-dance, rjam-groove; animation-duration: calc(var(--jam-beat) * 2), calc(var(--jam-beat) * 2);
      animation-timing-function: steps(1, end), ease-in-out; animation-iteration-count: infinite, infinite; animation-fill-mode: none; }
    ${S}[data-jam="dance"]) .jam { animation: none; }
    ${frameKeys("rjam-s-reach", SHEET.reach.row, SHEET.reach.ms)}
    ${frameKeys("rjam-s-tap", SHEET.tap.row, SHEET.tap.ms)}
    ${frameKeys("rjam-s-pack", SHEET.pack.row, SHEET.pack.ms)}
    ${frameKeys("rjam-s-dance", SHEET.dance.row, Array(SHEET.dance.frames).fill(1))}
    @keyframes rjam-groove {
      0%, 50%, 100% { translate: 0 0; rotate: 0deg; }
      25% { translate: 0 -3%; rotate: -2deg; }
      75% { translate: 0 -3%; rotate: 2deg; }
    }
  `;

  const css = `
    .bubble { z-index: 2; }
    .sprite, .fallback { transform-origin: 50% 100%; }
    .jam { position: absolute; inset: 0; pointer-events: none; transform-origin: 50% 100%; }
    .jam-prop { position: absolute; display: block; opacity: 0; transform: translate(-50%, -50%);
      filter: drop-shadow(1.5px 0 0 #fff) drop-shadow(-1.5px 0 0 #fff) drop-shadow(0 1.5px 0 #fff) drop-shadow(0 -1.5px 0 #fff); }
    .jam-prop svg { display: block; width: 100%; height: auto; overflow: visible; }
    .jam-phones { left: var(--jam-head-x, 37.5%); top: var(--jam-head-y, 32%); width: var(--jam-head-w, 45%); }
    .jam-phone { left: var(--jam-hand-x, 24%); top: var(--jam-hand-y, 64%); width: var(--jam-phone-w, 15%); rotate: -12deg; }
    .jam-screen-on, .jam-play, .jam-eq { opacity: 0; transition: opacity 200ms; }
    .jam-eq rect { transform-box: fill-box; transform-origin: 50% 100%; }
    .jam-note { position: absolute; width: calc(var(--width) * var(--s, .16)); color: var(--accent); opacity: 0;
      transform: translate(-50%, -50%); animation: rjam-float var(--d, 2.6s) ease-out forwards;
      filter: drop-shadow(1px 0 0 #fff) drop-shadow(-1px 0 0 #fff) drop-shadow(0 1px 0 #fff) drop-shadow(0 -1px 0 #fff); }
    .jam-note svg { display: block; width: 100%; height: auto; }

    :host([data-jam]) .jam-prop { opacity: 1; }

    /* Stage 1: rummage, phone pops out, headphones arc up and land on the head */
    :host([data-jam="reach"]) .sprite {
      animation-name: idle, rjam-rummage; animation-duration: 5.6s, 650ms;
      animation-timing-function: steps(1, end), ease-in-out; animation-iteration-count: infinite, 1;
    }
    :host([data-jam="reach"]) .fallback { animation: rjam-rummage 650ms ease-in-out; }
    :host([data-jam="reach"]) .jam-phone { animation: rjam-pull 650ms cubic-bezier(.34, 1.5, .6, 1) both; }
    :host([data-jam="reach"]) .jam-phones { animation: rjam-don 1100ms 450ms ease-out both; }

    /* Stage 2: screen on, tap play */
    :host([data-jam="tap"]) .jam-phone { animation: rjam-tap 600ms ease-out both; }
    :host([data-jam="tap"]) .jam-screen-on, :host([data-jam="tap"]) .jam-play { opacity: 1; }

    /* Stage 3: dance. Idle frames keep running (blinks), transforms do the moves. */
    :host([data-jam="dance"]) .sprite {
      animation-name: idle, rjam-bob; animation-duration: 5.6s, calc(var(--jam-beat) * 2);
      animation-timing-function: steps(1, end), ease-in-out; animation-iteration-count: infinite, infinite;
    }
    :host([data-jam="dance"]) .fallback { animation: rjam-bob calc(var(--jam-beat) * 2) ease-in-out infinite; }
    :host([data-jam="dance"]) .jam { animation: rjam-bob calc(var(--jam-beat) * 2) ease-in-out infinite; }
    :host([data-jam="dance"]) .jam-screen-on, :host([data-jam="dance"]) .jam-eq { opacity: 1; }
    :host([data-jam="dance"]) .jam-eq rect { animation: rjam-eq calc(var(--jam-beat) / 2) ease-in-out infinite alternate; }
    :host([data-jam="dance"]) .jam-eq rect:nth-child(2) { animation-delay: calc(var(--jam-beat) / -3); }
    :host([data-jam="dance"]) .jam-eq rect:nth-child(3) { animation-delay: calc(var(--jam-beat) / -7); }
    :host([data-jam="dance"]) .jam-eq rect:nth-child(4) { animation-delay: calc(var(--jam-beat) / -2); }

    /* Stage 4: pack up */
    :host([data-jam="pack"]) .jam-phones { animation: rjam-doff 700ms ease-in both; }
    :host([data-jam="pack"]) .jam-phone { animation: rjam-stow 500ms 300ms ease-in both; }

    /* Follow v1's pause when the tab is hidden */
    :host([data-paused]) .jam, :host([data-paused]) .jam * { animation-play-state: paused !important; }

    /* Debug crosshairs on the anchor points */
    :host([data-jam-debug]) .jam::before, :host([data-jam-debug]) .jam::after {
      content: ""; position: absolute; width: 10px; height: 10px; margin: -5px 0 0 -5px;
      border: 2px solid #ff2d55; border-radius: 50%; z-index: 3; }
    :host([data-jam-debug]) .jam::before { left: var(--jam-head-x, 37.5%); top: var(--jam-head-y, 32%); }
    :host([data-jam-debug]) .jam::after { left: var(--jam-hand-x, 24%); top: var(--jam-hand-y, 64%); border-color: #00c2ff; }

    @keyframes rjam-rummage {
      0%, 100% { translate: 0 0; rotate: 0deg; scale: 1 1; }
      30% { translate: 0 3%; rotate: -4deg; scale: 1.04 .95; }
      65% { translate: 0 1%; rotate: 3deg; scale: .98 1.02; }
    }
    @keyframes rjam-pull {
      from { opacity: 0; scale: .2; translate: 140% 40%; rotate: 25deg; }
      to { opacity: 1; scale: 1; translate: 0 0; rotate: -12deg; }
    }
    @keyframes rjam-stow {
      from { opacity: 1; scale: 1; translate: 0 0; rotate: -12deg; }
      to { opacity: 0; scale: .2; translate: 140% 40%; rotate: 25deg; }
    }
    @keyframes rjam-tap {
      0%, 100% { scale: 1; } 35% { scale: .88; } 65% { scale: 1.1; }
    }
    @keyframes rjam-don {
      0% { opacity: 0; scale: .3; translate: 25% 160%; rotate: 50deg; }
      40% { opacity: 1; scale: 1; translate: 0 -90%; rotate: -12deg; }
      70% { translate: 0 6%; rotate: 0deg; scale: 1.06 .9; }
      85% { translate: 0 -3%; scale: .98 1.04; }
      100% { opacity: 1; translate: 0 0; rotate: 0deg; scale: 1; }
    }
    @keyframes rjam-doff {
      0% { opacity: 1; translate: 0 0; rotate: 0deg; scale: 1; }
      40% { opacity: 1; translate: 0 -80%; rotate: -12deg; scale: 1; }
      100% { opacity: 0; translate: 25% 160%; rotate: 50deg; scale: .3; }
    }
    @keyframes rjam-bob {
      0%, 100% { translate: 0 0; rotate: -5deg; scale: 1.04 .96; }
      12% { scale: 1; }
      25% { translate: 0 -6%; rotate: 0deg; scale: .98 1.02; }
      50% { translate: 0 0; rotate: 5deg; scale: 1.04 .96; }
      62% { scale: 1; }
      75% { translate: 0 -6%; rotate: 0deg; scale: .98 1.02; }
    }
    @keyframes rjam-eq { from { scale: 1 .25; } to { scale: 1 1; } }
    @keyframes rjam-float {
      0% { opacity: 0; translate: 0 0; scale: .5; rotate: 0deg; }
      15% { opacity: 1; scale: 1; }
      70% { opacity: 1; }
      100% { opacity: 0; translate: var(--dx, 0px) calc(var(--width) * -.75); scale: .9; rotate: var(--r, 15deg); }
    }
    ${sheetUrl ? sheetCss : ""}
  `;

  // Headphones: band arcs over the top of the head, cups sit at the sides.
  const headphones = `<svg viewBox="0 0 100 64" aria-hidden="true">
    <path d="M13 46 C11 4 89 4 87 46" fill="none" stroke="#2b2338" stroke-width="8" stroke-linecap="round"/>
    <path d="M18 34 C20 12 80 12 82 34" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" opacity=".8"/>
    <rect x="2" y="34" width="20" height="28" rx="8" fill="var(--accent)" stroke="#2b2338" stroke-width="3"/>
    <rect x="78" y="34" width="20" height="28" rx="8" fill="var(--accent)" stroke="#2b2338" stroke-width="3"/>
  </svg>`;

  const phone = `<svg viewBox="0 0 30 52" aria-hidden="true">
    <rect x="1" y="1" width="28" height="50" rx="5" fill="#1b1726" stroke="#2b2338" stroke-width="2"/>
    <rect x="4" y="7" width="22" height="36" rx="2" fill="#2e2840"/>
    <rect class="jam-screen-on" x="4" y="7" width="22" height="36" rx="2" fill="var(--accent)"/>
    <path class="jam-play" d="M11.5 18 L21 25 L11.5 32 Z" fill="#fff"/>
    <g class="jam-eq" fill="#fff">
      <rect x="7" y="20" width="3" height="18" rx="1"/><rect x="11.5" y="20" width="3" height="18" rx="1"/>
      <rect x="16" y="20" width="3" height="18" rx="1"/><rect x="20.5" y="20" width="3" height="18" rx="1"/>
    </g>
    <rect x="11" y="46" width="8" height="2" rx="1" fill="#4a4060"/>
  </svg>`;

  const notes = [
    // eighth note
    `<svg viewBox="0 0 24 24"><ellipse cx="7.5" cy="18.5" rx="5" ry="3.8" transform="rotate(-20 7.5 18.5)" fill="currentColor"/><rect x="10.6" y="3" width="2.2" height="15.5" fill="currentColor"/><path d="M12.8 3 C13 7 19 8 17.5 14 C21 8 13.5 6.5 12.8 3 Z" fill="currentColor"/></svg>`,
    // beamed pair
    `<svg viewBox="0 0 24 24"><ellipse cx="5.5" cy="19" rx="4.4" ry="3.3" transform="rotate(-20 5.5 19)" fill="currentColor"/><ellipse cx="17.5" cy="17" rx="4.4" ry="3.3" transform="rotate(-20 17.5 17)" fill="currentColor"/><rect x="8.3" y="5" width="2" height="14" fill="currentColor"/><rect x="20.3" y="3" width="2" height="14" fill="currentColor"/><path d="M8.3 5 L22.3 3 L22.3 6.6 L8.3 8.6 Z" fill="currentColor"/></svg>`,
    // quarter note
    `<svg viewBox="0 0 24 24"><ellipse cx="9" cy="18.5" rx="5.2" ry="3.9" transform="rotate(-20 9 18.5)" fill="currentColor"/><rect x="12.2" y="2.5" width="2.2" height="16" fill="currentColor"/></svg>`,
  ];

  let sheet = null;
  try {
    sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
  } catch {
    sheet = null; // older browsers: fall back to a <style> element
  }

  const sheetReady = sheetUrl
    ? (() => {
        const img = new Image();
        img.src = sheetUrl;
        return img.decode().then(() => true, () => false);
      })()
    : Promise.resolve(false);

  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const controllers = new Map();
  const rand = (a, b) => a + Math.random() * (b - a);

  function attach(host) {
    if (controllers.has(host)) return;
    const root = host.shadowRoot;
    const character = root && root.querySelector(".character");
    if (!character) return; // not upgraded yet, or v1 internals changed

    if (sheet && "adoptedStyleSheets" in root) {
      if (!root.adoptedStyleSheets.includes(sheet))
        root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
    } else if (!root.querySelector("style[data-jam]")) {
      const style = document.createElement("style");
      style.setAttribute("data-jam", "");
      if (nonce) style.nonce = nonce;
      style.textContent = css;
      root.append(style);
    }

    let layer = root.querySelector(".jam");
    if (!layer) {
      layer = document.createElement("div");
      layer.className = "jam";
      layer.setAttribute("aria-hidden", "true");
      layer.innerHTML = `<span class="jam-prop jam-phone">${phone}</span><span class="jam-prop jam-phones">${headphones}</span>`;
      character.append(layer);
    }
    host.style.setProperty("--jam-beat", `${BEAT}ms`);
    if (debug) host.setAttribute("data-jam-debug", "");
    if (sheetUrl) {
      // Only switch to the drawn frames once the sheet has actually decoded.
      sheetReady.then((ok) => {
        if (!ok) return;
        host.style.setProperty("--jam-sheet", `url("${sheetUrl}")`);
        host.setAttribute("data-jam-sheet", "");
      });
    }

    let stage = "wait"; // wait | reach | tap | dance | pack | done
    let elapsed = 0; // active (visible, idle) ms spent in the current stage
    let target = cfg.delay; // how long the "wait" stage lasts
    let beatAcc = 0;
    let last = performance.now();

    const clearNotes = () => layer.querySelectorAll(".jam-note").forEach((n) => n.remove());

    function setStage(next) {
      stage = next;
      elapsed = 0;
      beatAcc = 0;
      if (next === "wait" || next === "done") {
        host.removeAttribute("data-jam");
        clearNotes();
      } else host.setAttribute("data-jam", next);
    }

    function spawnNote(fromPhone) {
      const left = host.getAttribute("position") === "left";
      let x, y;
      if (fromPhone && host.hasAttribute("data-jam-sheet") && !host.hasAttribute("data-fallback")) {
        x = 57; // the phone in the sheet's "listen" frame
        y = 46;
      } else if (fromPhone) {
        const cs = getComputedStyle(host);
        x = parseFloat(cs.getPropertyValue("--jam-hand-x")) || 24;
        y = (parseFloat(cs.getPropertyValue("--jam-hand-y")) || 64) - 8;
      } else if (!host.hasAttribute("data-open")) {
        // Bubble closed: notes all around, weighted to the open side of the screen.
        x = Math.random() < 0.65 ? rand(-35, 20) : rand(20, 100);
        y = rand(-10, 55);
      } else if (innerWidth >= 640 && !host.hasAttribute("preview")) {
        // Desktop: the bubble sits to the side, so keep notes above and right of it.
        x = rand(22, 102);
        y = rand(-15, 35);
      } else {
        // Mobile: the bubble sits above, so keep notes beside the body.
        x = Math.random() < 0.75 ? rand(-40, -5) : rand(95, 104);
        y = rand(20, 75);
      }
      if (left) x = 100 - x;
      // Notes near the screen edge drift back inward; the rest wander either way.
      const edge = left ? x < 30 : x > 70;
      const dx = edge ? (left ? 1 : -1) * rand(6, 26) : rand(-26, 26);
      const n = document.createElement("span");
      n.className = "jam-note";
      n.innerHTML = notes[Math.floor(Math.random() * notes.length)];
      n.style.left = `${x}%`;
      n.style.top = `${y}%`;
      n.style.setProperty("--dx", `${dx}px`);
      n.style.setProperty("--r", `${rand(-25, 25)}deg`);
      n.style.setProperty("--d", `${rand(2.2, 3.2)}s`);
      n.style.setProperty("--s", rand(0.12, 0.2).toFixed(3));
      n.addEventListener("animationend", () => n.remove(), { once: true });
      layer.append(n);
    }

    const ctrl = {
      play() {
        if (eligible() && (stage === "wait" || stage === "done")) setStage("reach");
      },
      stop() {
        if (stage === "reach" || stage === "tap" || stage === "dance") setStage("pack");
      },
    };

    function eligible() {
      return (
        host.hasAttribute("data-risen") &&
        host.getAttribute("data-phase") === "idle" &&
        !motion.matches
      );
    }

    const timer = setInterval(() => {
      const now = performance.now();
      const dt = Math.min(now - last, 250); // don't jump after throttling
      last = now;

      if (!host.isConnected) {
        clearInterval(timer);
        controllers.delete(host);
        setStage("wait");
        return;
      }
      // v1 replaying its walk-in, motion turned off, etc.: abort and start the wait over.
      if (!eligible()) {
        if (stage !== "wait" || elapsed) {
          setStage(stage === "done" ? "done" : "wait");
          target = cfg.delay;
        }
        return;
      }
      if (document.hidden) return; // freeze in place, like v1 does

      elapsed += dt;
      const dur = durations(host);
      switch (stage) {
        case "wait":
          if (elapsed >= target) setStage("reach");
          break;
        case "reach":
          if (elapsed >= dur.reach) setStage("tap");
          break;
        case "tap":
          if (elapsed >= dur.tap) {
            setStage("dance");
            spawnNote(true);
          }
          break;
        case "dance":
          beatAcc += dt;
          while (beatAcc >= BEAT) {
            beatAcc -= BEAT;
            spawnNote(false);
            if (Math.random() < 0.3) spawnNote(false);
          }
          if (elapsed >= cfg.dance) setStage("pack");
          break;
        case "pack":
          if (elapsed >= dur.pack) {
            if (cfg.repeat > 0) {
              setStage("wait");
              target = cfg.repeat;
            } else setStage("done");
          }
          break;
      }
    }, 100);

    controllers.set(host, ctrl);
  }

  const scan = () => document.querySelectorAll("saas-is-dead").forEach(attach);

  customElements.whenDefined("saas-is-dead").then(() => {
    scan();
    // Catch Reapers added later (SPA route changes, lazy embeds).
    new MutationObserver((records) => {
      for (const r of records)
        for (const node of r.addedNodes)
          if (node.nodeType === 1 && (node.matches("saas-is-dead") || node.querySelector("saas-is-dead")))
            return void scan();
    }).observe(document.documentElement, { childList: true, subtree: true });
  });

  window.ReaperJam = {
    play: () => controllers.forEach((c) => c.play()),
    stop: () => controllers.forEach((c) => c.stop()),
  };
})();
