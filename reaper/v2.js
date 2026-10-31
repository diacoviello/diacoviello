/* SaaS is dead - the standalone Reaper. No dependencies, cookies, or analytics. */
( () => {
	"use strict";
	if ( customElements.get( "saas-is-dead" ) ) return;
	const script=document.currentScript;
	const origin="https://saasisdead.si";
	const nonce=script?.nonce||"";
	const destination="https://saasisdead.si/";
	const dismissalKey="saasisdead_reaper_v2_dismissed";
	const introHold=12000;

	const css=`
    :host { all: initial; position: fixed; inset: 0; display: block; contain: strict; z-index: 50; pointer-events: none; font: 14px/1.4 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; color: #111017; color-scheme: light; --bg: #fff; --fg: #111017; --muted: #625d6d; --border: #ded8e8; --accent: #5f2ee0; --on-accent: #fff; --width: 80px; --gutter: 8px; --bubble-width: 300px; --bubble-lift: .5; --scale: 1; --bubble-offset: calc(var(--width)*(.833*var(--scale) + .2)); }
    :host([hidden]),:host([data-covered]) { display: none; }
    :host([preview]) { position: absolute; z-index: 2; }
    :host([data-dark]) { color-scheme: dark; --bg: #1c1c1c; --fg: #f0f0f0; --muted: #b8b8b8; --border: #555; --accent: #311e6e; --on-accent: #cfc4f2; }
    :host([size="regular"]) { --width: 96px; }
    *, *::before, *::after { box-sizing: border-box; }
    a { color: inherit; text-decoration: none; }
    button { font: inherit; color: inherit; cursor: pointer; }
    .cameo { position: absolute; right: max(var(--gutter),env(safe-area-inset-right,0px)); bottom: env(safe-area-inset-bottom,0px); width: var(--width); visibility: hidden; user-select: none; }
    :host([data-risen]) .cameo { visibility: visible; }
    :host([position="left"]) .cameo { right: auto; left: max(var(--gutter),env(safe-area-inset-left,0px)); }
    .bubble { position: absolute; right: var(--bubble-offset); bottom: calc(var(--width)*var(--bubble-lift)*var(--scale)); width: min(var(--bubble-width),calc(100vw - var(--bubble-offset) - 2*max(var(--gutter),env(safe-area-inset-left,0px),env(safe-area-inset-right,0px)))); border: 1px solid var(--border); border-radius: 8px; padding: 8px 10px 9px; background: var(--bg); color: var(--fg); pointer-events: none; opacity: 0; visibility: hidden; translate: 0 4px; transition: opacity 120ms,translate 120ms; }
    :host([data-open]) .bubble { pointer-events: auto; opacity: .88; visibility: visible; translate: 0 0; }
    .tail { position: absolute; overflow: visible; pointer-events: none; }
    .corner { right: calc(var(--width)*-.22 - 1px); bottom: calc(var(--width)*-.08 - 1px); width: calc(var(--width)*.36); height: calc(var(--width)*.22); }
    .side { display: none; right: calc(var(--width)*-.26); bottom: 30%; width: calc(var(--width)*.26); height: calc(var(--width)*.2); }
    .tail .fill { fill: var(--bg); }
    .tail .edge { fill: none; stroke: var(--border); vector-effect: non-scaling-stroke; }
    .credit { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 0 24px; min-height: 20px; font-size: 12px; font-weight: 750; }
    .credit img { width: 20px; height: 20px; object-fit: contain; }
    :host([data-dark]) .credit img { filter: invert(1) hue-rotate(180deg); }
    ::slotted(a) { font: inherit !important; color: inherit !important; text-decoration: none !important; }
    ::slotted(a:hover) { text-decoration: underline !important; }
    .message { margin: 4px 0 0; font-size: 12px; line-height: 1.3; font-weight: 750; overflow-wrap: anywhere; text-wrap: balance; }
    .visit { display: block; margin-top: 6px; padding: 7px 10px; background: var(--accent); color: var(--on-accent); border-radius: 4px; text-align: center; font-size: 11px; font-weight: 750; }
    .visit:hover { opacity: .88; }
    .dismiss { position: absolute; right: 2px; top: 2px; width: 28px; height: 28px; padding: 8px; border: 0; background: transparent; border-radius: 4px; color: var(--muted); }
    .dismiss:hover { background: color-mix(in srgb,var(--fg) 7%,transparent); color: var(--fg); }
    .dismiss svg { display: block; width: 12px; height: 12px; }
    .character { display: block; width: 100%; position: relative; pointer-events: auto; transform-origin: bottom right; transition: transform 160ms; touch-action: manipulation; }
    :host([position="left"]) .character { transform-origin: bottom left; }
    :host([data-minimized]) { --scale: .8; }
    .character { transform: scale(var(--scale)); }
        :host([position="left"]) .bubble { left: var(--bubble-offset); right: auto; }
    :host([position="left"]) .tail { right: auto; scale: -1 1; }
    :host([position="left"]) .corner { left: calc(var(--width)*-.22 - 1px); }
    :host([position="left"]) .side { left: calc(var(--width)*-.26); }
    .sprite,.fallback { display: block; width: var(--width); filter: drop-shadow(2px 0 0 #fff) drop-shadow(-2px 0 0 #fff) drop-shadow(0 2px 0 #fff) drop-shadow(0 -2px 0 #fff); }
    .sprite { aspect-ratio: 192/208; background-image: url("${origin}/mascot/spritesheet.webp"); background-size: 800% 1100%; background-repeat: no-repeat; background-position: 0 0; }
    .fallback { display: none; height: auto; }
    :host([data-fallback]) .sprite { display: none; }
    :host([data-fallback]) .fallback { display: block; }
    :host([data-phase="idle"]) .sprite { animation: idle 5.6s steps(1,end) infinite; }
    :host([data-phase="walk"]) .sprite { background-position-y: 20%; animation: walk 720ms steps(8,end) infinite; }
    :host([data-phase="wave"]) .sprite { background-position-y: 30%; animation: wave 840ms steps(1,end) both; }
    :host([data-phase="walk"]) .arrival { animation: arrive-right 1440ms linear both; }
    :host([position="left"][data-phase="walk"]) .arrival { animation-name: arrive-left; }
    :host([position="left"][data-phase="walk"]) .sprite { scale: -1 1; }
    :host([data-paused]) .sprite,:host([data-paused]) .arrival { animation-play-state: paused; }
    .character:focus-visible,.visit:focus-visible,.dismiss:focus-visible,::slotted(a:focus-visible) { outline: 2px solid var(--accent); outline-offset: 3px; }
    @keyframes arrive-right { from { transform: translateX(calc(100% + var(--gutter))); } to { transform: translateX(0); } }
    @keyframes arrive-left { from { transform: translateX(calc(-100% - var(--gutter))); } to { transform: translateX(0); } }
    @keyframes walk { to { background-position-x: 114.285714%; } }
    @keyframes wave { 0%,24% { background-position-x: 0; } 25%,49% { background-position-x: 14.285714%; } 50%,74% { background-position-x: 28.571429%; } 75%,100% { background-position-x: 42.857143%; } }
    @keyframes idle { 0%,8%,54%,100% { background-position-x: 0; } 10%,18%,48%,52% { background-position-x: 14.285714%; } 20%,28%,44% { background-position-x: 28.571429%; } 30%,42% { background-position-x: 42.857143%; } 46% { background-position-x: 57.142857%; } }
    @media(min-width:640px) {
      :host { --width: clamp(80px,16vh,140px); --gutter: 24px; --bubble-width: 540px; --bubble-lift: .06; }
      :host([size="regular"]) { --width: clamp(92px,18vh,160px); }
      .bubble { padding: 8px 14px 10px; text-align: center; }
      .corner { display: none; }
      .side { display: block; }
      .credit { min-height: 22px; font-size: 14px; }
      .credit img { width: 22px; height: 22px; }
      .message { margin-top: 3px; font-size: 14px; }
      .visit { margin-top: 6px; padding: 5px 12px; font-size: 13px; }
      .dismiss { right: 4px; top: 4px; }
    }
    @media(prefers-reduced-motion:reduce) { .sprite,.arrival { animation: none !important; } .character,.bubble { transition: none; } }
    @media print { :host { display: none; } }
  `;

	class Reaper extends HTMLElement {
		static observedAttributes=[
			"story",
			"saas",
			"project",
			"message",
			"size",
			"position",
			"theme",
			"preview-theme",
			"invite",
		];

		connectedCallback() {
			if ( this._controller ) return;
			const controller=new AbortController();
			this._controller=controller;
			this._manual=this.getAttribute( "interaction" )==="click";
			this._timers=new Set();
			this._suppressedUntil=0;
			this._suppressFocus=false;
			this._intro=false;
			this._hovered=false;
			this._focused=false;
			const signal=controller.signal;
			const isCurrent=() =>
				this._controller===controller&&!signal.aborted&&this.isConnected;
			if ( !this.shadowRoot ) {
				const root=this.attachShadow( { mode: "open" } );
				const style=document.createElement( "style" );
				if ( nonce ) style.nonce=nonce;
				style.textContent=css;
				root.append( style );
				const template=document.createElement( "template" );
				template.innerHTML=`<aside class="cameo" aria-label="SaaS is dead"><div class="bubble" role="note" aria-hidden="true" inert><button class="dismiss" type="button" aria-label="Hide message" title="Hide message"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button><div class="credit"><img src="${origin}/brand/mark.svg" alt="" width="24" height="24"><slot><a href="${destination}" target="_blank" rel="noopener">SaaS is dead</a></slot></div><p class="message"></p><a class="visit" href="${destination}" target="_blank" rel="noopener">Find open-source alternatives</a><svg class="tail corner" viewBox="0 0 36 22" aria-hidden="true"><path class="fill" d="M14 1C15 9 22 18 34 20.6 24 23 10 22 1 14Z"/><path class="edge" d="M14 1C15 9 22 18 34 20.6 24 23 10 22 1 14"/></svg><svg class="tail side" viewBox="0 0 26 20" aria-hidden="true"><path class="fill" d="M0 1C6 6 14 10 26 11 16 15 7 17 0 19Z"/><path class="edge" d="M0 1C6 6 14 10 26 11 16 15 7 17 0 19"/></svg></div><div class="arrival"><a class="character" href="${destination}" target="_blank" rel="noopener" aria-label="Find open-source alternatives at SaaS is dead"><span class="sprite" aria-hidden="true"></span><img class="fallback" src="${origin}/mascot/fallback.webp" width="480" height="455" alt="The SaaS is dead Reaper"></a></div></aside>`;
				root.append( template.content.cloneNode( true ) );
			}
			this._bubble=this.shadowRoot.querySelector( ".bubble" );
			this._character=this.shadowRoot.querySelector( ".character" );
			this._motion=matchMedia( "(prefers-reduced-motion: reduce)" );
			this._dark=matchMedia( "(prefers-color-scheme: dark)" );
			this._dark.addEventListener( "change", () => this._configure(), {
				signal,
			} );
			this._motion.addEventListener(
				"change",
				() => {
					if (
						!this._manual&&
						this._motion.matches&&
						this.hasAttribute( "data-risen" )
					) {
						this._clearTimers();
						this._finish();
					}
				},
				{ signal },
			);
			this._observer=new MutationObserver( () => this._configure() );
			this._observer.observe( document.documentElement, {
				attributes: true,
				attributeFilter: [ "class", "data-theme", "data-color-mode" ],
			} );
			// The nav drawer locks body scroll while open; step aside for it.
			this._observer.observe( document.body, {
				attributes: true,
				attributeFilter: [ "style" ],
			} );
			const visibility=() =>
				this.toggleAttribute( "data-paused", document.hidden );
			document.addEventListener( "visibilitychange", visibility, { signal } );
			visibility();
			const cameo=this.shadowRoot.querySelector( ".cameo" );
			cameo.addEventListener(
				"pointerenter",
				() => {
					if ( this._manual ) return;
					if ( performance.now()<this._suppressedUntil ) return;
					clearTimeout( this._hoverTimer );
					this._hovered=true;
					this._render();
				},
				{ signal },
			);
			cameo.addEventListener(
				"pointerleave",
				() => {
					if ( this._manual ) return;
					clearTimeout( this._hoverTimer );
					this._hoverTimer=setTimeout( () => {
						this._hovered=false;
						this._render();
					}, 200 );
				},
				{ signal },
			);
			cameo.addEventListener(
				"focusin",
				() => {
					if ( this._manual ) return;
					if ( !this._suppressFocus ) {
						this._focused=true;
						this._render();
					}
				},
				{ signal },
			);
			cameo.addEventListener(
				"focusout",
				( event ) => {
					if ( this._manual ) return;
					if (
						!this.contains( event.relatedTarget )&&
						!this.shadowRoot.contains( event.relatedTarget )
					) {
						this._focused=false;
						this._suppressFocus=false;
						this._render();
					}
				},
				{ signal },
			);
			cameo.addEventListener(
				"keydown",
				( event ) => {
					if ( event.key==="Escape" ) {
						event.preventDefault();
						this.minimize( true );
					}
				},
				{ signal },
			);
			this.shadowRoot
				.querySelector( ".dismiss" )
				.addEventListener( "click", () => this.minimize( true ), { signal } );
			for ( const anchor of this.shadowRoot.querySelectorAll( "a" ) )
				anchor.addEventListener(
					"click",
					( event ) => {
						if ( this._manual&&anchor===this._character ) {
							event.preventDefault();
							if ( this._minimized ) this.showMessage();
							else this.minimize();
						} else this.minimize();
					},
					{ signal },
				);
			let dismissed=false;
			if ( !this.hasAttribute( "preview" ) ) {
				try {
					dismissed=Number( localStorage.getItem( dismissalKey ) )>Date.now();
				} catch { }
			}
			this._minimized=this._manual||dismissed;
			this._configure();
			if ( this._manual ) {
				this.setAttribute( "data-risen", "" );
				this.setAttribute( "data-phase", "idle" );
				this._render();
			}
			const preload=new Image();
			preload.src=`${origin}/mascot/spritesheet.webp`;
			preload
				.decode()
				.catch( () => {
					if ( isCurrent() ) this.setAttribute( "data-fallback", "" );
				} )
				.then( () => {
					if ( !isCurrent()||this._manual ) return;
					if ( this.hasAttribute( "preview" ) ) {
						this.setAttribute( "data-risen", "" );
						this._finish();
					} else
						this._later( () => this._start( !dismissed ), dismissed? 1500:4000 );
				} );
		}

		disconnectedCallback() {
			this._controller?.abort();
			this._controller=null;
			this._observer?.disconnect();
			this._clearTimers();
			clearTimeout( this._hoverTimer );
		}

		attributeChangedCallback() {
			if ( this._controller ) this._configure();
		}

		_configure() {
			this.toggleAttribute( "data-covered", document.body.style.overflow==="hidden" );
			const saas=( this.getAttribute( "saas" )||"[SaaS name]" ).slice( 0, 48 );
			const project=( this.getAttribute( "project" )||"[Project]" ).slice(
				0,
				48,
			);
			const story=this.getAttribute( "story" );
			const standard=
				story==="buried"
					? `I buried my ${saas} subscription.`
					:story==="building"
						? `${project} exists. Your ${saas} subscription doesn\u2019t have to.`
						:"SaaS is dead. Long live open source.";
			this.shadowRoot.querySelector( ".message" ).textContent=(
				this.getAttribute( "message" )||standard
			).slice( 0, 160 );
			const invite=this.hasAttribute( "invite" );
			this.shadowRoot.querySelector( ".visit" ).textContent=invite
				? "Add it to your website"
				:"Find open-source alternatives";
			for ( const link of this.shadowRoot.querySelectorAll(
				".visit, .character",
			) ) {
				link.href=invite? `${destination}haunt`:destination;
				link.target=invite? "_self":"_blank";
				link.rel=invite? "":"noopener";
			}
			this._character.setAttribute(
				"aria-label",
				invite
					? "Add the Reaper to your website"
					:"Find open-source alternatives at SaaS is dead",
			);
			const root=document.documentElement;
			const explicit=
				( this.hasAttribute( "preview" )&&this.getAttribute( "preview-theme" ) )||
				root.getAttribute( "data-theme" )||
				root.getAttribute( "data-color-mode" )||
				( root.classList.contains( "dark" )
					? "dark"
					:root.classList.contains( "light" )
						? "light"
						:"" );
			const theme=this.getAttribute( "theme" )||"auto";
			this.toggleAttribute(
				"data-dark",
				theme==="dark"||
				( theme==="auto"&&
					( explicit? explicit==="dark":this._dark.matches ) ),
			);
		}

		_later( callback, delay ) {
			const timer=setTimeout( () => {
				this._timers.delete( timer );
				callback();
			}, delay );
			this._timers.add( timer );
		}
		_clearTimers() {
			this._timers?.forEach( clearTimeout );
			this._timers?.clear();
		}
		_start( full ) {
			this.setAttribute( "data-risen", "" );
			if ( !full||this._motion.matches||this.hasAttribute( "data-fallback" ) ) {
				this._finish();
				return;
			}
			this.setAttribute( "data-phase", "walk" );
			this._intro=false;
			this._render();
			this._later( () => this.setAttribute( "data-phase", "wave" ), 1440 );
			this._later( () => this._finish(), 2280 );
		}
		_finish() {
			this.setAttribute( "data-phase", "idle" );
			this._intro=!this._manual&&!this._minimized;
			this._render();
			if ( this._intro ) this._later( () => this._tuck(), introHold );
		}
		// Clears the page without counting as a dismissal, so it greets again next visit.
		_tuck() {
			this._minimized=true;
			this._intro=false;
			this._render();
		}
		_render() {
			const open=this._manual
				? !this._minimized
				:!!(
					this._intro||
					( this._minimized&&( this._hovered||this._focused ) )
				);
			this.toggleAttribute( "data-open", open );
			this.toggleAttribute( "data-minimized", !!this._minimized );
			this._bubble.inert=!open;
			this._bubble.setAttribute( "aria-hidden", String( !open ) );
			this.dispatchEvent(
				new CustomEvent( "reaper-state", {
					detail: { minimized: !!this._minimized },
				} ),
			);
		}
		minimize( focus=false ) {
			this._clearTimers();
			clearTimeout( this._hoverTimer );
			this._minimized=true;
			this._intro=false;
			this._hovered=false;
			this._focused=false;
			this._suppressedUntil=performance.now()+300;
			this.setAttribute( "data-phase", "idle" );
			this._render();
			if ( !this.hasAttribute( "preview" ) ) {
				try {
					localStorage.setItem( dismissalKey, String( Date.now()+14*864e5 ) );
				} catch { }
			}
			if ( focus ) {
				this._suppressFocus=true;
				this._character.focus( { preventScroll: true } );
			}
		}
		replay() {
			if ( this._manual ) {
				this.showMessage();
				return;
			}
			this._clearTimers();
			this._minimized=false;
			this._hovered=false;
			this._focused=false;
			this._suppressFocus=false;
			this._start( true );
		}
		showMessage() {
			this._clearTimers();
			this._minimized=false;
			this._hovered=false;
			this._focused=false;
			this.setAttribute( "data-risen", "" );
			this._finish();
		}
	}
	customElements.define( "saas-is-dead", Reaper );
} )();