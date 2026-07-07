import Reveal from '../components/Reveal.jsx'
import './Resources.css'

const DRILL = [
  {
    title: '"Disarray" — Full Show',
    meta: 'Mahwah Marching Thunderbirds · 2016',
    body: 'A Class: "Disarray" is a show title playing off one of the main musical themes "Dis Irae"',
    tag: 'Full Show video',
  },
  {
    title: '"Wonder" - Opener',
    meta: 'Riverdell High School · 2022',
    body: 'Exhibition Class: Show music includes music by Stevie Wonder.',
    tag: 'Opener video',
  },
  {
    title: '"Ragnarok" — Full Show',
    meta: 'Wayne Valley HS · 2022',
    body: 'Open Class State Champions: This show explores the Norse mythology of Ragnarok, the end of the world.',
    tag: 'Full Show video',
  },
  {
    title: '"Nova" — Full Show',
    meta: 'Wayne Valley HS · 2021',
    body: 'Open Class State Champions: This show explores the concept of a supernova, the death of a star. The band had no colorguard members this year, so we had to get creative...',
    tag: 'Full Show video',
  },
]

// Add performance recordings here — the Performances section below appears
// automatically once this array has at least one entry.
const PERFORMANCES = []

function MediaCard({ item, accent }) {
  return (
    <article className={`res-card res-card--${accent}`}>
      <div className="res-card__media">
        <span className="res-card__play">▶</span>
        <span className="res-card__tag">{item.tag}</span>
      </div>
      <div className="res-card__body">
        <h3>{item.title}</h3>
        <p className="res-card__meta">{item.meta}</p>
        <p>{item.body}</p>
      </div>
    </article>
  )
}

export default function Resources() {
  return (
    <>
      <header className="m-pagehead">
        <Reveal as="p" className="m-eyebrow">Resources</Reveal>
        <Reveal as="h1" delay={0.05}>Selected work &amp; media</Reveal>
        <div className="m-divider" />
        <Reveal as="p" className="m-lead" delay={0.1}>
          A growing library of drill design examples and performance recordings.
          Swap these placeholders for your own videos, PDFs, and images.
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
                  Charts, floor designs, and full visual programs
                </p>
              </div>
            </Reveal>
            <div className="m-grid m-grid--3">
              {DRILL.map((item, i) => (
                <Reveal key={item.title} from="up" delay={i * 0.08}>
                  <MediaCard item={item} accent="gold" />
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
                    <MediaCard item={item} accent="cyan" />
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          <Reveal className="res-note">
            <p>
              Want drill design for your ensemble, or a custom arrangement?{' '}
              <a href="mailto:diacovmusic@gmail.com">Get in touch →</a>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
