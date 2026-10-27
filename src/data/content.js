export const PERSON = {
  name: 'Sean Soriano',
  role: 'Software Engineer',
  email: 'seansoriano.me@gmail.com',
  github: 'https://github.com/seansoriano13',
}

export const HERO = {
  headlineA: ['Built for', 'real work'],
  headlineB: ['Tuned to', 'the detail'],
  about:
    'I build software for the way a business actually runs: systems people open every morning, not demos. Most recently, an ERP that took a whole company’s leave, sales, purchasing and commission off paper.',
  scrollCue: ['Scroll down', 'Step inside'],
  cta: 'View my work',
}

export const NOTES = {
  behind: ['Solo.', 'End to end.'],
  stats: [
    { value: 2000, suffix: '+', caption: 'commits on one production ERP since March 2026' },
    { value: 292, suffix: '', caption: 'database migrations, written and shipped' },
  ],
  stack: ['React', 'Node.js', 'Supabase', 'Claude'],
  stackNote: 'Claude is my pair programmer. I design, decide and review; it helps me ship faster.',
  design: {
    title: 'Design included',
    body: 'I design what I build. My last site started from a blank canvas.',
  },
  location: 'Based in the Philippines',
  availability: 'Available for freelance',
  availabilityCta: 'Start a project',
}

export const WORKS = [
  {
    id: 'website',
    index: '01',
    title: 'T3CK Group',
    kind: 'Corporate website',
    year: '2026',
    role: 'Design & development, solo',
    stack: ['React', 'Vite', 'Tailwind', 'Supabase'],
    link: { href: 'https://t3ckgroup.vercel.app', label: 't3ckgroup.vercel.app' },
    summary:
      'The public face of a Philippine group of companies in defense procurement, medical and rescue equipment, retail, engineering and disaster-risk consulting. Designed from a blank canvas, then built and shipped by one person.',
    shots: [
      { src: '/shots/web-hero.webp', alt: 'T3CK Group website hero: “Gear you trust when it matters most”' },
      { src: '/shots/web-divisions.webp', alt: 'T3CK Group website: the group’s six divisions, with T3CK Trading open' },
      { src: '/shots/web-footer.webp', alt: 'T3CK Group website: contact details over the oversized T3CK footer mark' },
    ],
  },
  {
    id: 'erp',
    index: '02',
    title: 'T3CK Group ERP',
    kind: 'Internal operations system',
    year: 'Mar 2026 — now',
    role: 'Architecture, design & development, solo',
    stack: ['React', 'Supabase', 'Postgres + RLS', 'pdf-lib'],
    summary:
      'The system the company runs on every working day. HR, sales, purchasing and commission moved off paper forms, spreadsheets and side-channel messages and into one set of live records, each built around how the business actually talks about its own work.',
    highlights: [
      {
        src: '/shots/erp-dashboard.webp',
        title: 'Super Admin dashboard',
        body: 'Where the day starts: your own task roadmap, and a radar of every salesperson’s pipeline value and how their deals spread across Stages.',
      },
      {
        src: '/shots/erp-flow-canvas.webp',
        title: 'Flow Canvas',
        body: 'The business draws its own sales process as a graph of Stages, with loops, skips and branches. Each publish freezes a numbered version, and live deals stay on the version they started with.',
      },
      {
        src: '/shots/erp-sor.webp',
        title: 'SOR window',
        body: 'Every Sales Opportunity Registration opens in one window: where it sits in its flow, how long it spent at each Stage, and what needs attention before it can move.',
      },
      {
        src: '/shots/erp-purchasing.webp',
        title: 'Purchasing Dashboard',
        body: 'All buying across every deal on one board, grouped by what is still outstanding: not checked, to purchase, still canvassing, bought but not received, filed.',
      },
      {
        src: '/shots/erp-form.webp',
        title: 'Printed HR forms',
        body: 'Approved leave and overtime print straight onto the TG-11 and TG-12 slips HR files for payroll, with a QR code anyone holding the paper can scan to check it against the live record.',
      },
    ],
  },
]

export const STUDY = {
  title: 'Anduril',
  kind: 'Study — a recreation of anduril.com, built for practice',
  year: '2026',
  stack: ['React', 'Vite', 'GSAP', 'Tailwind'],
  link: { href: 'https://anduril-clone-seanxiety.vercel.app/', label: 'anduril-clone-seanxiety.vercel.app' },
  summary:
    'Rebuilding a site I admire, scroll by scroll, to learn how its motion and layout hold together. The design is Anduril’s; the code is mine.',
  shot: { src: '/shots/study-anduril.webp', alt: 'Recreation of the Anduril homepage' },
}
