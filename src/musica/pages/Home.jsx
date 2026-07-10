import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import './Home.css'

const logo = '/images/diablo-symbol.png'

const HIGHLIGHTS = [
  {
    icon: '𝄞',
    title: 'Performance',
    body: 'A versatile performer with years on stage — from concert halls to the competitive field.',
  },
  {
    icon: '✎',
    title: 'Drill Design',
    body: 'Custom marching band drill and visual programs tailored to each ensemble’s story and skill.',
  },
  {
    icon: '♪',
    title: 'Education',
    body: 'Private lessons and classroom instruction that build musicianship from the fundamentals up.',
  },
]

export default function Home() {
  return (
    <>
      <section className="home-hero">
        <div className="m-container home-hero__inner">
          <div className="home-hero__text">
            <Reveal as="h1" className="home-hero__title" from="up" delay={0.15}>
              <div style={ { fontSize: '6.5rem', letterSpacing: '0.23em' } }>
                <i style={ { fontStyle: 'normal', fontSize: '2.3rem', verticalAlign: '55%', display: 'inline-block' } }>♬</i>
                <span style={ { fontFamily: "'Segoe Script', cursive", fontSize: '6.5rem', fontWeight: 'bold', fontStyle: 'italic', letterSpacing: '0.03em',  display: 'inline-block' } }>Music </span>
              </div>
              is the<span> movement </span> <br />
              of<span> sound </span> to 
              <p style={ { justifyContent: 'flex-center' } }> reach 
              the <span>  soul </span></p>
              for the <span> education </span>
              <br />
              of its <span>virtue  </span><div style={ { display: 'inline', fontSize: '3.2rem', verticalAlign: '12%'  } }>♪</div>
            </Reveal>
            <Reveal as="p" className="home-hero__eyebrow" from="up">
              - Plato
            </Reveal>
            <Reveal as="p" className="home-hero__lead" from="up" delay={0.16}>
              I’m David Iacoviello — a professional musician, marching-arts drill
              designer, and educator. This is where performance, pedagogy, and
              visual design meet.
            </Reveal>
            <Reveal className="home-hero__cta" from="up" delay={0.24}>
              <Link to="/lamusica/experience" className="m-btn m-btn--primary">
                Explore my work
              </Link>
              <Link to="/lamusica/about" className="m-btn m-btn--ghost">
                About me
              </Link>
            </Reveal>
          </div>

          <Reveal className="home-hero__art" from="zoom" delay={0.1}>
            <span className="home-hero__halo" />
            <img src={logo} alt="Diablo En Música emblem" className="home-hero__logo" />
          </Reveal>
        </div>

        <div className="home-hero__marquee" aria-hidden="true">
          <div className="home-hero__marquee-track">
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i}>
                Performer&nbsp;·&nbsp;Drill&nbsp;Designer&nbsp;·&nbsp;Music&nbsp;Educator&nbsp;·&nbsp;Arranger&nbsp;·&nbsp;Clinician&nbsp;·&nbsp;
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="m-section">
        <div className="m-container">
          <Reveal as="p" className="m-sec-kicker">What I do</Reveal>
          <Reveal as="h2" className="m-sec-title" delay={0.05}>
            Three disciplines, one voice
          </Reveal>
          <div className="m-divider" />
          <div className="m-grid m-grid--3">
            {HIGHLIGHTS.map((h, i) => (
              <Reveal key={h.title} className="m-card" from="up" delay={i * 0.08}>
                <div className="m-card__icon">{h.icon}</div>
                <h3>{h.title}</h3>
                <p>{h.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="m-section m-section--tight">
        <div className="m-container">
          <Reveal className="home-cta">
            <div>
              <h2 className="m-sec-title">Looking for the developer?</h2>
              <p className="m-lead" style={{ margin: '0.6rem 0 0' }}>
                The yang to this yin — software engineering, projects, and
                technical work live on the Techné side.
              </p>
            </div>
            <Link to="/techne" className="m-btn m-btn--ghost home-cta__btn">
              Cross to Techné →
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
