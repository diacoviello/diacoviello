import { Link } from 'react-router-dom'
import Reveal from '../../musica/components/Reveal.jsx'
import Typewriter from '../components/Typewriter.jsx'
import SocialIcons from '../components/SocialIcons.jsx'
import { profile, social, projects } from '../data.js'
import './Home.css'

const logo = '/images/diablo-symbol.svg'

export default function Home() {
  return (
    <>
      <section className="thome-hero">
        <div className="m-container thome-hero__inner">
          <div className="thome-hero__text">
            <Reveal as="p" className="thome-hero__eyebrow" from="up">
              {'< Techné / Developer >'}
            </Reveal>
            <Reveal as="h1" className="thome-hero__name" from="up" delay={0.06}>
              {profile.name}
            </Reveal>
            <Reveal as="p" className="thome-hero__type" from="up" delay={0.12}>
              I’m&nbsp;
              <Typewriter words={profile.roles} />
            </Reveal>
            <Reveal as="p" className="thome-hero__tag" from="up" delay={0.18}>
              {profile.tagline}
            </Reveal>
            <Reveal className="thome-hero__cta" from="up" delay={0.24}>
              <Link to="/techne/projects" className="m-btn m-btn--primary">
                View projects
              </Link>
              <a
                href={profile.resumeUrl}
                className="m-btn m-btn--ghost"
                target="_blank"
                rel="noreferrer noopener"
              >
                Resume ↗
              </a>
            </Reveal>
            <Reveal className="thome-hero__social" from="up" delay={0.3}>
              <SocialIcons items={social} />
            </Reveal>
          </div>

          <Reveal className="thome-hero__art" from="zoom" delay={0.1}>
            <span className="thome-hero__halo" />
            <img src={logo} alt="" className="thome-hero__logo" />
          </Reveal>
        </div>
      </section>

      <section className="m-section">
        <div className="m-container">
          <Reveal as="p" className="m-sec-kicker">Selected work</Reveal>
          <Reveal as="h2" className="m-sec-title" delay={0.05}>
            A few things I’ve built
          </Reveal>
          <div className="m-divider" />
          <div className="m-grid m-grid--3">
            {projects.slice(0, 3).map((p, i) => (
              <Reveal key={p.title} className="m-card thome-proj" from="up" delay={i * 0.08}>
                <div className="m-card__icon">{'</>'}</div>
                <h3>{p.title}</h3>
                <p>{p.tags.join(' · ')}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="thome-more">
            <Link to="/techne/projects" className="m-btn m-btn--ghost">
              See all projects →
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="m-section m-section--tight">
        <div className="m-container">
          <Reveal className="thome-cross">
            <div>
              <h2 className="m-sec-title">Also a musician &amp; drill designer</h2>
              <p className="m-lead" style={{ margin: '0.6rem 0 0' }}>
                The yin to this yang — performance, marching-arts design, and music
                education live on the La Música side.
              </p>
            </div>
            <Link to="/lamusica" className="m-btn m-btn--ghost thome-cross__btn">
              Cross to La Música →
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
