import Reveal from '../components/Reveal.jsx'
import './Background.css'

const CHAPTERS = [
  {
    year: 'The Beginning',
    title: 'A pair of sticks and a metronome',
    body: 'Music started as rhythm — tapping on everything in reach until it turned into real practice. Early ensembles taught me how individual parts lock into something bigger than any one player.',
  },
  {
    year: 'The Field',
    title: 'Finding the marching arts',
    body: 'Marching band and the front ensemble world reframed everything. Here, music wasn’t just heard — it was seen. Visual design, drill, and choreography became as important to me as the notes themselves.',
  },
  {
    year: 'The Craft',
    title: 'From performer to designer',
    body: 'Years of performing became years of designing. I learned to chart drill, arrange for ensembles, and shape a show’s emotional arc from the first downbeat to the closing hit.',
  },
  {
    year: 'Today',
    title: 'Teaching the next generation',
    body: 'Now I split my time between the stage, the design table, and the classroom — passing on the discipline, creativity, and joy that music gave me.',
  },
]

export default function Background() {
  return (
    <>
      <header className="m-pagehead">
        <Reveal as="p" className="m-eyebrow">Background</Reveal>
        <Reveal as="h1" delay={0.05}>How I got here</Reveal>
        <div className="m-divider" />
        <Reveal as="p" className="m-lead" delay={0.1}>
          A path from curious kid with a practice pad to performer, designer, and
          educator — told in four chapters.
        </Reveal>
      </header>

      <section className="m-section" style={{ paddingTop: 0 }}>
        <div className="m-container">
          <div className="bg-chapters">
            {CHAPTERS.map((c, i) => (
              <Reveal
                key={c.title}
                className="bg-chapter"
                from={i % 2 === 0 ? 'left' : 'right'}
                delay={0.05}
              >
                <span className="bg-chapter__year">{c.year}</span>
                <h3 className="bg-chapter__title">{c.title}</h3>
                <p>{c.body}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="bg-quote">
            <p>
              “Music is the silence between the notes — and the marching arts taught
              me that the space between performers tells just as much of the story.”
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
