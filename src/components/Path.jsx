import { PATH } from '../data/content'
import { scrollToTarget } from '../lib/smoothScroll'

// The Path: where the work has happened, newest first, ending at the school.
// The seal sits in ink like the rest of the page and shows its own colours on
// hover, leaning toward the cursor as it does.
export default function Path() {
  const { school } = PATH
  return (
    <section id="path" className="section path" aria-labelledby="path-title">
      <header className="section-head">
        <span className="section-index" data-reveal>
          (06)
        </span>
        <h2 id="path-title" className="section-title" data-split>
          Path
        </h2>
        <p className="section-sub" data-reveal>
          Where the work has happened so far.
        </p>
      </header>

      <ol className="path-list">
        {PATH.stops.map((s) => (
          <li key={s.where} className="path-stop" data-reveal>
            <a
              href={s.href}
              onClick={(e) => {
                e.preventDefault()
                scrollToTarget(s.href)
              }}
            >
              <span className="path-when">{s.when}</span>
              <span className="path-where">{s.where}</span>
              <span className="path-what">{s.what}</span>
              <span className="path-arrow" aria-hidden="true">
                ↑
              </span>
            </a>
          </li>
        ))}
      </ol>

      <div className="school" data-parallax data-reveal>
        <span className="school-seal" data-depth="-12" data-zoom="0.04">
          <img src={school.seal.src} alt={school.seal.alt} loading="lazy" decoding="async" width="316" height="316" />
        </span>
        <div className="school-text" data-depth="6">
          <span className="note-label">School</span>
          <p className="school-name">{school.name}</p>
          <p className="school-campus">{school.campus}</p>
          <p className="note-body">{school.note}</p>
        </div>
      </div>
    </section>
  )
}
