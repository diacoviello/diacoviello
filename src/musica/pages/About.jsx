import Reveal from '../components/Reveal.jsx'
import './About.css'

const logo = '/images/diablo-symbol.png'

const INSTRUMENTS = [
  'Percussion',
  'Marimba',
  'Drum Set',
  'Front Ensemble',
  'Piano',
  'Composition',
]

const SKILLS = [
  'Drill / Visual Design',
  'Arranging',
  'Ensemble Direction',
  'Music Theory',
  'Score Study',
  'Clinics & Adjudication',
]

export default function About() {
  return (
    <>
      <header className="m-pagehead">
        <Reveal as="p" className="m-eyebrow">About</Reveal>
        <Reveal as="h1" delay={0.05}>The story behind the sound</Reveal>
        <div className="m-divider" />
        <Reveal as="p" className="m-lead" delay={0.1}>
          Equal parts performer, designer, and teacher — driven by the belief
          that great music and great visual storytelling come from the same place.
        </Reveal>
      </header>

      <section className="m-section" style={{ paddingTop: 0 }}>
        <div className="m-container">
          <div className="m-grid about-grid">
            <Reveal from="left" className="about-portrait">
              {/* Drop a photo at public/images/headshot.png to replace this frame */}
              <div className="about-portrait__frame">
                <img src={logo} alt="" className="about-portrait__art" />
                <span className="about-portrait__tag">D. Iacoviello</span>
              </div>
            </Reveal>

            <Reveal from="right" className="m-prose" delay={0.08}>
              <p>
                I’m a professional musician and marching-arts drill designer whose
                work lives at the intersection of <em>performance</em>,{' '}
                <em>pedagogy</em>, and <em>visual design</em>. Whether I’m on a
                stage, in a classroom, or charting a closing set for a competitive
                ensemble, the goal is the same: tell a story the audience can feel.
              </p>
              <p>
                My journey began with a pair of drumsticks and an obsession with
                how rhythm moves people. That curiosity grew into a career spanning
                live performance, private instruction, and designing the drill and
                visual programs that bring marching ensembles to life.
              </p>
              <p>
                The name <strong>Diablo En Música</strong> reflects a dual nature —
                the disciplined craft of music balanced with the playful, daring
                spirit it takes to push an idea somewhere new. It’s the same balance
                you’ll find across this site: art and engineering, yin and yang.
              </p>

              <div className="about-tags">
                <div>
                  <h4 className="about-tags__label">Instruments &amp; Voice</h4>
                  <div className="m-pills">
                    {INSTRUMENTS.map((i) => (
                      <span className="m-pill" key={i}>{i}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="about-tags__label">Craft</h4>
                  <div className="m-pills">
                    {SKILLS.map((s) => (
                      <span className="m-pill m-pill--cyan" key={s}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal className="m-stats">
            <div className="m-stat">
              <strong>10+</strong>
              <span>Years performing</span>
            </div>
            <div className="m-stat">
              <strong>50+</strong>
              <span>Students taught</span>
            </div>
            <div className="m-stat">
              <strong>20+</strong>
              <span>Drill programs</span>
            </div>
            <div className="m-stat">
              <strong>∞</strong>
              <span>Ideas in motion</span>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
