import { SERVICES } from '../data/content'
import { scrollToTarget } from '../lib/smoothScroll'

export default function Services() {
  return (
    <section id="services" className="section services" aria-labelledby="services-title">
      <header className="section-head">
        <span className="section-index" data-reveal>
          (02)
        </span>
        <h2 id="services-title" className="section-title" data-split>
          Services
        </h2>
        <p className="section-sub" data-reveal>
          What I can build for you, and the Work that proves each one.
        </p>
      </header>

      <ol className="services-list">
        {SERVICES.map((s, i) => (
          <li key={s.title} className="service" data-reveal>
            <span className="service-index">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="service-title">{s.title}</h3>
            <p className="service-body">{s.body}</p>
            <a
              href={s.proof.href}
              className="service-proof"
              onClick={(e) => {
                e.preventDefault()
                scrollToTarget(s.proof.href)
              }}
            >
              <span className="service-proof-term">Proof</span>
              <span className="text-link">{s.proof.label}</span>
              <span aria-hidden="true">↑</span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  )
}
