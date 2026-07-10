import Reveal from '../components/Reveal.jsx'
import QuoteBlock from '../components/QuoteBlock.jsx'

// Paste a quote here to show it under the page title (leave empty to hide).
const QUOTE = ''
const QUOTE_AUTHOR = ''

const SUBSECTIONS = [
  {
    id: 'music-education',
    num: '01',
    title: 'Music Education',
    lead: 'Building musicianship in the classroom and rehearsal hall.',
    items: [
      {
        role: 'General Music',
        org: 'Elementary School Program',
        date: '2013 — 2015',
        body: 'Taught General Music at Joyce Kilmer Elementary School (4th and 5th grade). Designed curriculum, lesson plans, and assessments for all classes. ',
      },
      {
        role: 'Instrumental Music Teacher 4-8',
        org: 'Mahwah, NJ',
        date: '2013 — 2018',
        body: 'Taught Instrumental Music at Joyce Kilmer Elementary School (4th and 5th grade) and Ramapo Ridge Middle School (6th through 8th grade). Also directed the Jazz Ensemble, Percussion Ensemble, as well as the "Pride" & "Spirit" Bands at Ramapo Ridge Middle School',
      },
      {
        role: 'Instrumental Music Teacher 6-8',
        org: 'Kinnelon, NJ',
        date: '2018 — 2019',
        body: 'Taught Instrumental Music at Pearl R. Miller Middle School (6th through 8th grade). Taught a variety of instrument groups, including brass, woodwinds, and percussion. Also directed the 7/8th grade Concert Band.',
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
        role: 'Brass/Marching Instructor at Old Bridge High School Marching Band',
        org: 'Marching Ensembles',
        date: '2008 — 2010',
        body: 'Brass Coordinator focusing on developing musicianship, technique, and performance skills for the brass section. Assisted in teaching marching technique and learning drill.',
      },
      {
        role: 'Brass/Visual/Marching Caption Head at West Essex Regional High School Marching Band',
        org: 'Marching Ensembles',
        date: '2009 — 2016',
        body: 'Brass Coordinator focusing on developing musicianship, technique, and performance skills for the brass section. Oversaw the instruction of marching techniques and ran rehearsals focusing on visual & drill design.',
      },
      {
        role: 'Drill Designer at Middletown South High School Marching Band',
        org: 'Marching Ensembles',
        date: '2016',
        body: 'Design drill and visual program for the marching band. Attend scheduled rehearsals to assist in the instruction/learning process.',
      },
      {
        role: 'Brass/Visual/Marching Caption Head at Wayne Valley High School Marching Band',
        org: 'Marching Ensembles',
        date: '2017 — 2023',
        body: 'Brass Coordinator focusing on developing musicianship, technique, and performance skills for the brass section. Oversaw the instruction of marching techniques and assisted in rehearsals focusing on visual & drill design.',
      },
      {
        role: 'Drill Designer at Wayne Valley High School Marching Band',
        org: 'Marching Ensembles',
        date: '2017 — 2023',
        body: 'Brass Coordinator focusing on developing musicianship, technique, and performance skills for the brass section. Oversaw the instruction of marching techniques and assisted in rehearsals focusing on visual & drill design.',
      },
      {
        role: 'Drill Designer at Riverdell High School Marching Band',
        org: 'Marching Ensembles',
        date: '2022 - 2024',
        body: 'Design drill and visual program for the marching band. Attend scheduled rehearsals to assist in the instruction/learning process.',
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
        role: 'Private Lessons — Trumpet & More',
        org: 'Independent Studio',
        date: 'Ongoing',
        body: 'Personalized lessons covering technique, reading, theory, and audition prep for students of all levels — beginner to advanced.',
      },
      {
        role: 'Clinics & Masterclasses',
        org: 'Schools & Programs around NJ',
        date: 'By invitation',
        body: 'Guest clinics on brass technique, marching fundamentals, and the design process behind a competitive show.',
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
        date: '2007 — Present',
        body: 'Concert, chamber, and contemporary performances across a range of venues and settings.',
      },
      {
        role: 'Marching / Indoor Performer',
        org: 'Competitive Circuits',
        date: '2002 — present',
        body: 'Years of competitive performance experience that directly informs how I design and teach today; from the high school level to DCI/DCA participation.',
      },
    ],
  },
  {
    id: 'service',
    num: '05',
    title: 'Service',
    lead: 'Giving back — honoring those who served.',
    items: [
      {
        role: 'NJ State Director — Taps for Veterans',
        org: 'Taps for Veterans · non-profit',
        date: 'Present',
        body: 'Lead the New Jersey chapter of a non-profit that provides live buglers, free of charge, to perform Taps at military funerals and events — so every veteran is honored with a real, live performance rather than a recording.',
      },
    ],
  },
]

export default function Experience() {
  return (
    <>
      <header className="m-pagehead">
        <Reveal as="p" className="m-eyebrow">Experience</Reveal>
        <Reveal as="h1" delay={0.05}>Where am I going, Where have I been?</Reveal>
        <QuoteBlock quote={QUOTE} author={QUOTE_AUTHOR} />
        <Reveal as="p" className="m-lead" delay={0.1}>
          The threads of a single career — education, design, instruction,
          performance, and service — woven together over the years.
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
