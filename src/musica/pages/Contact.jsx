import Reveal from '../components/Reveal.jsx'
import QuoteBlock from '../components/QuoteBlock.jsx'
import ContactForm from '../../shared/contact/ContactForm.jsx'

// Paste a quote here to show it under the page title (leave empty to hide).
const QUOTE = ''
const QUOTE_AUTHOR = ''

const TOPICS = [
  'Drill design',
  'Custom arrangement',
  'Private lessons',
  'Performance / booking',
  'Something else',
]

export default function Contact() {
  return (
    <>
      <header className="m-pagehead">
        <Reveal as="p" className="m-eyebrow">Contact</Reveal>
        <Reveal as="h1" delay={0.05}>Let&rsquo;s make music</Reveal>
        <QuoteBlock quote={QUOTE} author={QUOTE_AUTHOR} />
        <Reveal as="p" className="m-lead" delay={0.1}>
          Drill for your ensemble, an arrangement, lessons, or a performance —
          tell me what you have in mind.
        </Reveal>
      </header>

      <section className="m-section" style={{ paddingTop: 0 }}>
        <div className="m-container contact-layout">
          <Reveal className="contact-aside" from="left">
            <h2>Get in touch</h2>
            <p>
              Whether you&rsquo;re a director planning next season&rsquo;s show or a
              student looking for lessons, send a note and I&rsquo;ll get back to you.
            </p>
            <div className="m-pills">
              {TOPICS.slice(0, -1).map((t) => (
                <span key={t} className="m-pill">{t}</span>
              ))}
            </div>
          </Reveal>

          <Reveal from="up" delay={0.08}>
            <ContactForm site="musica" topics={TOPICS} />
          </Reveal>
        </div>
      </section>
    </>
  )
}
