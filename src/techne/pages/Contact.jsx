import Reveal from '../../musica/components/Reveal.jsx'
import ContactForm from '../../shared/contact/ContactForm.jsx'
import SocialIcons from '../components/SocialIcons.jsx'
import { social } from '../data.js'

const TOPICS = ['Job opportunity', 'Freelance project', 'Collaboration', 'Something else']

export default function Contact() {
  return (
    <>
      <header className="m-pagehead">
        <Reveal as="p" className="m-eyebrow">Contact</Reveal>
        <Reveal as="h1" delay={0.05}>Let&rsquo;s build something</Reveal>
        <div className="m-divider" />
        <Reveal as="p" className="m-lead" delay={0.1}>
          Roles, freelance work, or a project you want a second pair of hands
          on; I&rsquo;d like to hear about it.
        </Reveal>
      </header>

      <section className="m-section" style={{ paddingTop: 0 }}>
        <div className="m-container contact-layout">
          <Reveal className="contact-aside" from="left">
            <h2>Get in touch</h2>
            <p>
              Send a message with the form, or find me on LinkedIn and GitHub.
            </p>
            <SocialIcons items={social} />
          </Reveal>

          <Reveal from="up" delay={0.08}>
            <ContactForm site="techne" topics={TOPICS} />
          </Reveal>
        </div>
      </section>
    </>
  )
}
