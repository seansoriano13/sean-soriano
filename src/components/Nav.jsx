import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { PERSON } from '../data/content'
import { scrollToTarget } from '../lib/smoothScroll'
import Mark from './Mark'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#services', label: 'Services' },
  { href: '#process', label: 'Process' },
  { href: '#study', label: 'Study' },
  { href: '#contact', label: 'Contact' },
]

const go = (target) => (e) => {
  e.preventDefault()
  scrollToTarget(target)
}

export default function Nav({ entered, reduced }) {
  const root = useRef(null)

  useGSAP(
    () => {
      if (!entered) return
      gsap.from('.nav-fade', { autoAlpha: 0, y: -12, duration: 1.2, stagger: 0.08, ease: 'expo.out', delay: 0.6 })
    },
    { scope: root, dependencies: [entered] },
  )

  // Without the Dive's timeline, the nav's ink and backdrop flip here once
  // the hero has scrolled past. Created after layout settles.
  useGSAP(
    () => {
      if (!entered || !reduced) return
      const el = root.current
      ScrollTrigger.create({
        trigger: '.dive-frame',
        start: 'bottom 72px',
        end: 'max',
        onToggle: (self) => {
          el.style.setProperty('--nav-fg', self.isActive ? '#141210' : '#F6F4EF')
          el.classList.toggle('nav-solid', self.isActive)
        },
      })
    },
    { dependencies: [entered, reduced] },
  )

  return (
    <header ref={root} className="nav">
      <nav className="nav-links" aria-label="Sections">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={go(l.href)} className={`nav-fade nav-link nav-link-${l.label.toLowerCase()}`}>
            {l.label}
          </a>
        ))}
      </nav>
      <a href="#top" className="nav-logo" onClick={go(0)} aria-label={`${PERSON.name}, back to top`}>
        <Mark className="nav-mark" />
        <span className="nav-name">{PERSON.name}</span>
      </a>
      <a href={`mailto:${PERSON.email}`} className="nav-fade nav-email">
        {PERSON.email}
      </a>
    </header>
  )
}
