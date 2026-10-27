import { WORKS } from '../data/content'

export default function Work() {
  return (
    <section id="work" className="section work" aria-labelledby="work-title">
      <header className="section-head">
        <span className="section-index" data-reveal>
          (01)
        </span>
        <h2 id="work-title" className="section-title" data-split>
          Work
        </h2>
        <p className="section-sub" data-reveal>
          Three systems, each designed and built end to end by one engineer.
        </p>
      </header>

      {WORKS.map((w) => (
        <article key={w.id} className={`work-item work-${w.id}`} aria-labelledby={`${w.id}-title`}>
          <div className="work-top">
            <span className="work-index" data-reveal>
              {w.index}
            </span>
            <div className="work-heading">
              <h3 id={`${w.id}-title`} className="work-title" data-split>
                {w.title}
              </h3>
              <p className="work-kind" data-reveal>
                {w.kind}
              </p>
            </div>
          </div>

          <div className="work-body">
            <dl className="work-meta" data-reveal>
              <div>
                <dt>Year</dt>
                <dd>{w.year}</dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd>{w.role}</dd>
              </div>
              <div>
                <dt>Stack</dt>
                <dd>{w.stack.join(' · ')}</dd>
              </div>
              {w.link && (
                <div>
                  <dt>{w.link.term ?? 'Live'}</dt>
                  <dd>
                    <a href={w.link.href} target="_blank" rel="noreferrer" className="text-link">
                      {w.link.label} <span aria-hidden="true">↗</span>
                    </a>
                  </dd>
                </div>
              )}
            </dl>
            <p className="work-summary" data-reveal>
              {w.summary}
            </p>
          </div>

          {w.shots && (
            <div className="shots">
              {w.shots.map((s, i) => (
                <figure key={s.src} className={`shot shot-${i}`} data-clip>
                  <img src={s.src} alt={s.alt} loading="lazy" decoding="async" />
                </figure>
              ))}
            </div>
          )}

          {w.highlights && (
            <ol className="highlights">
              {w.highlights.map((h, i) => (
                <li key={h.title} className="highlight">
                  <figure className="shot" data-clip>
                    <img src={h.src} alt={`${w.title}: ${h.title}`} loading="lazy" decoding="async" />
                  </figure>
                  <div className="highlight-text" data-reveal>
                    <span className="highlight-index">{String(i + 1).padStart(2, '0')}</span>
                    <h4 className="highlight-title">{h.title}</h4>
                    <p className="highlight-body">{h.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </article>
      ))}
    </section>
  )
}
