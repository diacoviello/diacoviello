import Reveal from '../../musica/components/Reveal.jsx'
import { experience } from '../data.js'

export default function Experience() {
  return (
    <>
      <header className="m-pagehead">
        <Reveal as="p" className="m-eyebrow">Experience</Reveal>
        <Reveal as="h1" delay={0.05}>Building &amp; shipping</Reveal>
        <div className="m-divider" />
        <Reveal as="p" className="m-lead" delay={0.1}>
          Hands-on development work — from production software to community-driven
          open-source projects.
        </Reveal>
      </header>

      <section className="m-section" style={{ paddingTop: 0 }}>
        <div className="m-container">
          <div className="m-timeline">
            {experience.map((x, i) => (
              <Reveal key={x.role + x.org} className="m-tl-item" from="left" delay={i * 0.08}>
                <span className="m-tl-date">{x.date}</span>
                <h3>{x.role}</h3>
                <p className="m-tl-org">
                  {x.org}
                  <span className="m-pill m-pill--cyan" style={{ marginLeft: '0.6rem' }}>
                    {x.type}
                  </span>
                </p>
                <p>{x.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
