/* ============================================================
   Techné — developer portfolio content
   Ported from the original devportfolio public/profile/*.json.
   Edit here to update the site.
   ============================================================ */

export const profile = {
  name: 'David Iacoviello',
  roles: ['a Developer', 'a Musician', 'an Educator', 'a Lifelong Learner'],
  tagline: 'Full-stack web developer with a musician’s ear for detail.',
  resumeUrl:
    'https://drive.google.com/file/d/1rakyDb6IEw6FRVOPJjkFdugiogypxS8f/view?usp=sharing',
}

export const social = [
  { network: 'linkedin', label: 'LinkedIn', href: 'http://www.linkedin.com/in/david-iacoviello' },
  { network: 'github', label: 'GitHub', href: 'https://github.com/diacoviello' },
  { network: 'email', label: 'Email', href: 'mailto:iacoviello.david@gmail.com' },
]

export const about = {
  image: '/images/techne/about/SKP_2301.jpg',
  paragraphs: [
    'Hello, and welcome to my developer portfolio.',
    'I attended Rutgers Coding Bootcamp in 2021 and received my certification for **Full-Stack Web Development**. Since then, I have continued working to learn as much as I can involving development, coding, etc. Check out my resume and links to see some projects I’ve done and am currently working on!',
    'Alongside my abilities with development libraries and technologies, I am fluent in using music software as well as GIMP for photo editing. In general, I am passionate about learning the in’s and out’s of anything related to technology and music. I find my motivation for learning comes naturally to me and I am always up for a new challenge!',
  ],
  skills: [
    'JavaScript',
    'React',
    'Node.js',
    'HTML & CSS',
    'Python',
    'REST APIs',
    'Git / GitHub',
    'Material UI',
    'Music Software',
    'GIMP',
  ],
}

export const education = [
  {
    date: 'Jan 2021 – Apr 2021',
    title: '2U Bootcamp — Full-Stack Development',
    org: 'Rutgers University, New Brunswick, NJ',
    detail: 'Certified in Full-Stack Web Development.',
    icon: '/images/techne/education/Rutgers.png',
  },
  {
    date: 'Sep 2006 – May 2012',
    title: 'B.M. Music Education, minor in Philosophy',
    org: 'William Paterson University, Wayne, NJ',
    detail: 'GPA 3.8',
    icon: '/images/techne/education/wpu.png',
  },
]

export const experience = [
  {
    role: 'Development Intern',
    org: 'Accesso',
    type: 'Part-time',
    date: '07/2022 – Present',
    body: 'Assist in the development and maintenance of software being built, and help create intuitive, effective documentation for the projects.',
  },
  {
    role: 'Production Support Engineer',
    org: 'Accesso',
    type: 'Full-time',
    date: '03/2023 – Present',
    body: 'Assist in providing technical support for production systems. This includes troubleshooting issues, performing maintenance tasks, and collaborating with development teams to resolve problems.',
  },
]

export const projects = [
  {
    title: 'The Hatch Timer',
    image: '/images/techne/projects/The-Hatch-Timer.png',
    body: 'The countdown timer from the TV show *LOST*, built with vanilla HTML/CSS/JavaScript. Every 108 minutes the button must be pushed — cosplay as Desmond, Locke, or Jack and see what happens if you miss it.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    links: [
      { text: 'GitHub', href: 'https://github.com/diacoviello/The_Hatch_Computer' },
      { text: 'Live', href: 'https://diacoviello.github.io/The_Hatch_Computer/' },
    ],
  },
  {
    title: 'Metronome',
    image: '/images/techne/projects/metronome.png',
    body: 'An in-browser metronome for practice, with a responsive range slider, manual tap-tempo buttons, and dynamic tempo indicators.',
    tags: ['HTML', 'CSS', 'Materialize', 'JavaScript', 'Timer.js'],
    links: [
      { text: 'GitHub', href: 'https://github.com/diacoviello/metronome' },
      { text: 'Live', href: 'https://diacoviello.github.io/metronome/' },
    ],
  },
  {
    title: 'MyConcerts',
    image: '/images/techne/projects/concertsHomepage.png',
    body: 'A concert-attendance tracker built in React. Log in to track favorite artists, see upcoming concerts, and view charts of previously attended shows. *Note: no longer live (expired API keys).*',
    tags: ['React', 'Material UI', 'JavaScript'],
    links: [{ text: 'GitHub', href: 'https://github.com/zpinson/concertapp' }],
  },
  {
    title: 'ImgSaverCSV',
    image: '/images/techne/projects/python-logo.jpg',
    body: 'A Python script that reads URL links from a .csv file and downloads them into a chosen directory, naming each file from the matching row.',
    tags: ['Python', 'Pandas', 'urllib', 'Anaconda'],
    links: [{ text: 'GitHub', href: 'https://github.com/diacoviello/ImgSaverCSV' }],
  },
  {
    title: 'Team Generator',
    image: '/images/techne/projects/teamgeneratorimg.png',
    body: 'A program that generates team-member profile ID cards and renders them to a page.',
    tags: ['JavaScript', 'Node', 'npm'],
    links: [{ text: 'GitHub', href: 'https://github.com/diacoviello/TeamProfileGen' }],
  },
  {
    title: 'My Weather Dashboard',
    image: '/images/techne/projects/weatherDash.png',
    body: 'Find the weather in major cities with a 5-day forecast, icon display, and data from the OpenWeather API. Searched cities are saved to local storage for quick recall.',
    tags: ['JavaScript', 'Node', 'npm', 'APIs'],
    links: [
      { text: 'GitHub', href: 'https://github.com/diacoviello/Weather' },
      { text: 'Live', href: 'https://diacoviello.github.io/Weather/' },
    ],
  },
]
