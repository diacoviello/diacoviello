import Reveal from '../components/Reveal.jsx'
import './Resources.css'

const DRILL = [
  {
    title: 'Opener — “Ascension”',
    meta: 'Full Marching Band · 20XX',
    body: 'A sweeping opener built around expanding arcs and a brass feature. Drill chart + visual concept.',
    tag: 'Drill Chart',
  },
  {
    title: 'Production — “Glasswork”',
    meta: 'Indoor Percussion · 20XX',
    body: 'Floor design and staging for a contemporary percussion production with shifting geometric forms.',
    tag: 'Floor Design',
  },
  {
    title: 'Closer — “Echoes”',
    meta: 'Full Marching Band · 20XX',
    body: 'An emotional closer that resolves the show’s arc with a company-front impact moment.',
    tag: 'Visual Program',
  },
]

const PERFORMANCES = [
  {
    title: 'Solo Percussion Recital',
    meta: 'Concert Hall · 20XX',
    body: 'A program of solo marimba and multi-percussion repertoire.',
    tag: 'Live',
  },
  {
    title: 'Ensemble Feature',
    meta: 'Festival · 20XX',
    body: 'Featured performance with a chamber percussion ensemble.',
    tag: 'Live',
  },
  {
    title: 'Competitive Field Show',
    meta: 'Championship · 20XX',
    body: 'Performance highlight from a competitive marching season.',
    tag: 'Field',
  },
]

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
