import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Reveal from '../components/Reveal.jsx'
import QuoteBlock from '../components/QuoteBlock.jsx'
import './Resources.css'

// Paste a quote here to show it under the page title (leave empty to hide).
const QUOTE = ''
const QUOTE_AUTHOR = ''

const DRILL = [
  {
    title: '"Disarray" — Full Show',
    meta: 'Mahwah Marching Thunderbirds · 2016',
    body: 'A Class: "Disarray" is a show title playing off one of the main musical themes "Dis Irae"',
    tag: 'Full Show video',
    youtube: 'DZiOiexBSWc',
  },
  {
    title: '"Wonder" - Opener',
    meta: 'Riverdell High School · 2022',
    body: 'Exhibition Class: Show music includes music by Stevie Wonder.',
    tag: 'Opener video',
    youtube: '7hyN5KdFt0Q',
  },
  {
    title: '"Ragnarok" — Full Show',
    meta: 'Wayne Valley HS · 2022',
    body: 'Open Class State Champions: This show explores the Norse mythology of Ragnarok, the end of the world.',
    tag: 'Full Show video',
    youtube: '6rvSjQOJSeI',
  },
  {
    title: '"Nova" — Full Show',
    meta: 'Wayne Valley HS · 2021',
    body: 'Open Class State Champions: This show explores the concept of a supernova, the death of a star. The band had no colorguard members this year, so we had to get creative...',
    tag: 'Full Show video',
    youtube: 'RN6oH_5aU8k',
  },
]

// Add performance recordings here — the Performances section below appears
// automatically once this array has at least one entry.
const PERFORMANCES = []

function MediaCard({ item, accent, onPlay }) {
  const hasVideo = Boolean(item.youtube)
  const Media = hasVideo ? 'button' : 'div'
  return (
    <article className={`res-card res-card--${accent}`}>
      <Media
        type={hasVideo ? 'button' : undefined}
        className="res-card__media"
        onClick={hasVideo ? () => onPlay(item) : undefined}
        aria-label={hasVideo ? `Play video: ${item.title}` : undefined}
      >
        {hasVideo && (
          <img
            className="res-card__thumb"
            src={`https://i.ytimg.com/vi/${item.youtube}/maxresdefault.jpg`}
            onError={(e) => {
              e.currentTarget.src = `https://i.ytimg.com/vi/${item.youtube}/hqdefault.jpg`
            }}
            alt=""
            loading="lazy"
          />
        )}
        <span className="res-card__play" aria-hidden="true">▶</span>
        <span className="res-card__tag">{item.tag}</span>
      </Media>
      <div className="res-card__body">
        <h3>{item.title}</h3>
        <p className="res-card__meta">{item.meta}</p>
        <p>{item.body}</p>
      </div>
    </article>
  )
}

function VideoModal({ item, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return createPortal(
    <div className="res-modal" role="dialog" aria-modal="true" aria-label={item.title} onClick={onClose}>
      <div className="res-modal__inner" onClick={(e) => e.stopPropagation()}>
        <button className="res-modal__close" onClick={onClose} aria-label="Close video">
          ×
        </button>
        <div className="res-modal__frame">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${item.youtube}?autoplay=1&rel=0`}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <p className="res-modal__caption">
          {item.title} · {item.meta}
        </p>
      </div>
    </div>,
    document.body,
  )
}

export default function Resources() {
  const [active, setActive] = useState(null)

  return (
    <>
      <header className="m-pagehead">
        <Reveal as="p" className="m-eyebrow">About</Reveal>
        <QuoteBlock
          as="h1"
          quote={ '“Music in the soul can be heard by the universe.”' }
          author="Lao Tzu"
        />
        <Reveal as="p" className="m-lead" delay={ 0.1 }>
          Performer, designer, teacher, lifelong learner.
        </Reveal>
      </header>

      <section className="m-section" style={{ paddingTop: 0 }}>
        <div className="m-container">
          <div className="m-subsection" id="drill-design">
            <Reveal className="m-subhead">
              <span className="m-subhead__num">01</span>
              <div>
                <h2>Drill Design Examples</h2>
                <p className="m-sec-kicker" style={{ marginTop: '0.4rem', color: 'var(--ink-dim)' }}>
                  Full shows &amp; features I designed
                </p>
              </div>
            </Reveal>
            <div className="m-grid m-grid--3">
              {DRILL.map((item, i) => (
                <Reveal key={item.title} from="up" delay={i * 0.08}>
                  <MediaCard item={item} accent="gold" onPlay={setActive} />
                </Reveal>
              ))}
            </div>
          </div>

          {PERFORMANCES.length > 0 && (
            <div className="m-subsection" id="performances">
              <Reveal className="m-subhead">
                <span className="m-subhead__num">02</span>
                <div>
                  <h2>Performances</h2>
                  <p className="m-sec-kicker" style={{ marginTop: '0.4rem', color: 'var(--ink-dim)' }}>
                    Live recordings from stage and field
                  </p>
                </div>
              </Reveal>
              <div className="m-grid m-grid--3">
                {PERFORMANCES.map((item, i) => (
                  <Reveal key={item.title} from="up" delay={i * 0.08}>
                    <MediaCard item={item} accent="cyan" onPlay={setActive} />
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          <Reveal className="res-note">
            <p>
              Want drill design for your ensemble, or a custom arrangement?{' '}
              <a href="mailto:iacoviello.david@gmail.com">Get in touch →</a>
            </p>
          </Reveal>
        </div>
      </section>

      {active && <VideoModal item={active} onClose={() => setActive(null)} />}
    </>
  )
}
