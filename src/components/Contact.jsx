import { useState } from 'react'
import { PERSON } from '../data/content'

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PERSON.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${PERSON.email}`
    }
  }

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <span className="section-index" data-reveal>
        (03)
      </span>
      <h2 id="contact-title" className="contact-title" data-split>
        Have something to build?
      </h2>
      <div className="contact-row" data-reveal>
        <a href={`mailto:${PERSON.email}`} className="contact-email">
          {PERSON.email}
        </a>
        <button type="button" className="pill pill-ink" onClick={copy}>
          <span className="pill-label" aria-live="polite">
            {copied ? 'Copied' : 'Copy email'}
          </span>
        </button>
      </div>
      <footer className="footer" data-reveal>
        <a href={PERSON.github} target="_blank" rel="noreferrer" className="text-link">
          GitHub <span aria-hidden="true">↗</span>
        </a>
        <span>© 2026 {PERSON.name}</span>
        <span>Built with React, GSAP and Lenis</span>
      </footer>
    </section>
  )
}
