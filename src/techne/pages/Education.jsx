import Reveal from '../../musica/components/Reveal.jsx'
import { education } from '../data.js'
import './Education.css'

export default function Education() {
  return (
    <>
      <header className="m-pagehead">
        <Reveal as="p" className="m-eyebrow">Education</Reveal>
        <Reveal as="h1" delay={0.05}>Where I learned the craft</Reveal>
        <div className="m-divider" />
        <Reveal as="p" className="m-lead" delay={0.1}>
          A full-stack certification on top of a music degree — code and
          composition, side by side.
        </Reveal>
      </header>

      <section className="m-section" style={{ paddingTop: 0 }}>
        <div className="m-container">
          <div className="m-timeline">
            {education.map((e, i) => (
              <Reveal key={e.title} className="m-tl-item tedu-item" from="left" delay={i * 0.08}>
                <div className="tedu-logo">
                  <img src={e.icon} alt="" />
                </div>
                <div className="tedu-body">
                  <span className="m-tl-date">{e.date}</span>
                  <h3>{e.title}</h3>
                  <p className="m-tl-org">{e.org}</p>
                  <p>{e.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
