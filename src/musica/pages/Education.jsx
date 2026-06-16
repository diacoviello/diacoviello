import Reveal from '../components/Reveal.jsx'

const TIMELINE = [
  {
    date: '20XX — 20XX',
    title: 'Master of Music',
    org: 'University / Conservatory',
    body: 'Advanced study in performance and pedagogy, with a focus on the marching arts and ensemble design. (Replace with your real degree & institution.)',
  },
  {
    date: '20XX — 20XX',
    title: 'Bachelor of Music',
    org: 'University / Conservatory',
    body: 'Comprehensive training in theory, history, performance, and music education. Active member of the marching and concert ensembles.',
  },
  {
    date: '20XX',
    title: 'Music Education Foundations',
    org: 'High School / Early Training',
    body: 'Where it began — first lessons, first ensembles, and the spark that turned into a career.',
  },
]

const CERTS = [
  {
    icon: '🎓',
    title: 'Teaching Credentials',
    body: 'State / district music education certification for K–12 instruction.',
  },
  {
    icon: '🥁',
    title: 'Marching Arts Clinics',
    body: 'Continuing education through DCI / WGI-style clinics and design workshops.',
  },
  {
    icon: '📜',
    title: 'Adjudication Training',
    body: 'Certified to judge and adjudicate marching and percussion ensembles.',
  },
]

export default function Education() {
  return (
    <>
      <header className="m-pagehead">
        <Reveal as="p" className="m-eyebrow">Education</Reveal>
        <Reveal as="h1" delay={0.05}>Trained in theory &amp; the field</Reveal>
        <div className="m-divider" />
        <Reveal as="p" className="m-lead" delay={0.1}>
          A foundation built in the conservatory and refined on the competitive
          field — formal study paired with hands-on craft.
        </Reveal>
      </header>

      <section className="m-section" style={{ paddingTop: 0 }}>
        <div className="m-container">
          <Reveal as="p" className="m-sec-kicker">Academic path</Reveal>
          <Reveal as="h2" className="m-sec-title" delay={0.05}>Degrees &amp; study</Reveal>
          <div className="m-divider" />

          <div className="m-timeline">
            {TIMELINE.map((item, i) => (
              <Reveal key={item.title} className="m-tl-item" from="left" delay={i * 0.08}>
                <span className="m-tl-date">{item.date}</span>
                <h3>{item.title}</h3>
                <p className="m-tl-org">{item.org}</p>
                <p>{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="m-section" style={{ paddingTop: 0 }}>
        <div className="m-container">
          <Reveal as="p" className="m-sec-kicker">Beyond the degree</Reveal>
          <Reveal as="h2" className="m-sec-title" delay={0.05}>
            Certifications &amp; continued training
          </Reveal>
          <div className="m-divider" />
          <div className="m-grid m-grid--3">
            {CERTS.map((c, i) => (
              <Reveal key={c.title} className="m-card" from="up" delay={i * 0.08}>
                <div className="m-card__icon">{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
