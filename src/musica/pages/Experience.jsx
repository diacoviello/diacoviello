import Reveal from '../components/Reveal.jsx'

const SUBSECTIONS = [
  {
    id: 'music-education',
    num: '01',
    title: 'Music Education',
    lead: 'Building musicianship in the classroom and rehearsal hall.',
    items: [
      {
        role: 'Music Educator / Director',
        org: 'School / District',
        date: '20XX — Present',
        body: 'Direct concert and marching ensembles, teach general and instrumental music, and develop curriculum that meets students where they are.',
      },
      {
        role: 'Percussion Instructor',
        org: 'High School Programs',
        date: '20XX — 20XX',
        body: 'Led sectionals, designed warm-up packets, and prepared percussion sections for performance and competition.',
      },
    ],
  },
  {
    id: 'marching-band',
    num: '02',
    title: 'Marching Band Design / Instruction',
    lead: 'Charting drill and shaping the visual story of competitive ensembles.',
    items: [
      {
        role: 'Drill / Visual Designer',
        org: 'Marching Ensembles',
        date: '20XX — Present',
        body: 'Design full drill and visual programs — coordinating music, movement, and staging into a cohesive, competition-ready show.',
      },
      {
        role: 'Visual / Movement Instructor',
        org: 'Marching & Indoor Programs',
        date: '20XX — 20XX',
        body: 'Taught technique, cleaned sets, and translated design intent into performance on the field and floor.',
      },
    ],
  },
  {
    id: 'lessons',
    num: '03',
    title: 'Lessons',
    lead: 'One-on-one instruction tailored to each student’s goals.',
    items: [
      {
        role: 'Private Lessons — Percussion & More',
        org: 'Independent Studio',
        date: 'Ongoing',
        body: 'Personalized lessons covering technique, reading, theory, and audition prep for students of all levels — beginner to advanced.',
      },
      {
        role: 'Clinics & Masterclasses',
        org: 'Schools & Programs',
        date: 'By invitation',
        body: 'Guest clinics on percussion technique, marching fundamentals, and the design process behind a competitive show.',
      },
    ],
  },
  {
    id: 'performances',
    num: '04',
    title: 'Performances',
    lead: 'On stage and on the field — a decade of live music.',
    items: [
      {
        role: 'Performing Musician',
        org: 'Ensembles & Solo',
        date: '20XX — Present',
        body: 'Concert, chamber, and contemporary performances across a range of venues and settings.',
      },
      {
        role: 'Marching / Indoor Performer',
        org: 'Competitive Circuits',
        date: '20XX — 20XX',
        body: 'Years of competitive performance experience that directly informs how I design and teach today.',
      },
    ],
  },
]

export default function Experience() {
  return (
    <>
      <header className="m-pagehead">
        <Reveal as="p" className="m-eyebrow">Experience</Reveal>
        <Reveal as="h1" delay={0.05}>Where the work happens</Reveal>
        <div className="m-divider" />
        <Reveal as="p" className="m-lead" delay={0.1}>
          Four threads of a single career — education, design, instruction, and
          performance — woven together over the years.
        </Reveal>
      </header>

      <section className="m-section" style={{ paddingTop: 0 }}>
        <div className="m-container">
          {SUBSECTIONS.map((s) => (
            <div className="m-subsection" id={s.id} key={s.id}>
              <Reveal className="m-subhead">
                <span className="m-subhead__num">{s.num}</span>
                <div>
                  <h2>{s.title}</h2>
                  <p className="m-sec-kicker" style={{ marginTop: '0.4rem', color: 'var(--ink-dim)' }}>
                    {s.lead}
                  </p>
                </div>
              </Reveal>

              <div className="m-timeline">
                {s.items.map((item, i) => (
                  <Reveal
                    key={item.role}
                    className="m-tl-item"
                    from="left"
                    delay={i * 0.08}
                  >
                    <span className="m-tl-date">{item.date}</span>
                    <h3>{item.role}</h3>
                    <p className="m-tl-org">{item.org}</p>
                    <p>{item.body}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
