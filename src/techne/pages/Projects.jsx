import Reveal from '../../musica/components/Reveal.jsx'
import RichText from '../components/RichText.jsx'
import { projects } from '../data.js'
import './Projects.css'

export default function Projects() {
  return (
    <>
      <header className="m-pagehead">
        <Reveal as="p" className="m-eyebrow">Projects</Reveal>
        <Reveal as="h1" delay={0.05}>Things I’ve built</Reveal>
        <div className="m-divider" />
        <Reveal as="p" className="m-lead" delay={0.1}>
          A selection of web apps, tools, and experiments — many at the
          intersection of code and music.
        </Reveal>
      </header>

      <section className="m-section" style={{ paddingTop: 0 }}>
        <div className="m-container">
          <div className="m-grid m-grid--3 tproj-grid">
            {projects.map((p, i) => (
              <Reveal key={p.title} from="up" delay={(i % 3) * 0.08}>
                <article className="tproj">
                  <div className="tproj__media">
                    <img src={p.image} alt={p.title} loading="lazy" />
                  </div>
                  <div className="tproj__body">
                    <h3>{p.title}</h3>
                    <p className="tproj__desc">
                      <RichText text={p.body} />
                    </p>
                    <div className="m-pills tproj__tags">
                      {p.tags.map((t) => (
                        <span className="m-pill" key={t}>{t}</span>
                      ))}
                    </div>
                    <div className="tproj__links">
                      {p.links.map((l) =>
                        l.href ? (
                          <a
                            key={l.text}
                            href={l.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="tproj__link"
                          >
                            {l.text} ↗
                          </a>
                        ) : (
                          <span key={l.text} className="tproj__link is-disabled">
                            {l.text}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
