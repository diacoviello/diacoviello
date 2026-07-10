import Reveal from '../components/Reveal.jsx'
import QuoteBlock from '../components/QuoteBlock.jsx'
import './Background.css'

// Paste a quote here to show it under the page title (leave empty to hide).
const QUOTE = ''
const QUOTE_AUTHOR = ''

const CHAPTERS = [
  {
    year: 'The Beginning',
    title: 'A hand-me-down trumpet',
    body: 'It began in the third grade with a hand-me-down trumpet and a hunger to learn everything I could about music. Early ensembles taught me how individual parts lock into something far bigger than any one player.',
  },
  {
    year: 'The Field',
    title: 'Finding the marching arts',
    body: 'Marching band reframed everything. Here, music wasn’t just heard — it was seen. Visual design, drill, and choreography became as important to me as the notes themselves.',
  },
  {
    year: 'The Craft',
    title: 'From performer to designer',
    body: 'Years of performing became years of designing. I learned to chart drill, arrange for ensembles, and shape a show’s emotional arc from the first downbeat to the closing hit.',
  },
  {
    year: 'Today',
    title: 'Performing, designing, giving back',
    body: 'Now I split my time between the stage, the design table, and the classroom — and I serve as New Jersey State Director for Taps for Veterans, honoring those who served with live Taps. It’s all one thing: passing on the discipline, creativity, and meaning that music gave me.',
  },
]

export default function Background() {
  return (
    <>
      <header className="m-pagehead">
        <Reveal as="p" className="m-eyebrow">Background</Reveal>
        <Reveal as="h1" delay={0.05}>How I got here</Reveal>
        <QuoteBlock quote={QUOTE} author={QUOTE_AUTHOR} />
        <Reveal as="p" className="m-lead" delay={0.1}>
          A path from a curious kid with a hand-me-down trumpet to performer,
          designer, and educator — told in four chapters.
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
