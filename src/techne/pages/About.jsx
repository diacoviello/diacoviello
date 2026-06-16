import Reveal from '../../musica/components/Reveal.jsx'
import RichText from '../components/RichText.jsx'
import { about } from '../data.js'
import './About.css'

export default function About() {
  return (
    <>
      <header className="m-pagehead">
        <Reveal as="p" className="m-eyebrow">About</Reveal>
        <Reveal as="h1" delay={0.05}>A bit about me</Reveal>
        <div className="m-divider" />
        <Reveal as="p" className="m-lead" delay={0.1}>
          Full-stack developer, lifelong musician, and perpetual learner.
        </Reveal>
      </header>

      <section className="m-section" style={{ paddingTop: 0 }}>
        <div className="m-container">
          <div className="m-grid tabout-grid">
            <Reveal from="left" className="tabout-portrait">
              <div className="tabout-portrait__frame">
                <img src={about.image} alt="David Iacoviello" />
              </div>
            </Reveal>

            <Reveal from="right" className="m-prose" delay={0.08}>
              {about.paragraphs.map((p, i) => (
                <p key={i}>
                  <RichText text={p} />
                </p>
              ))}

              <h4 className="tabout-skills-label">Skills &amp; Tools</h4>
              <div className="m-pills">
                {about.skills.map((s, i) => (
                  <span className={`m-pill ${i % 2 ? 'm-pill--cyan' : ''}`} key={s}>
                    {s}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
