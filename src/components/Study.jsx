import Shot from './Shot'
import { STUDY } from '../data/content'

export default function Study() {
  return (
    <section id="study" className="section study" aria-labelledby="study-title">
      <header className="section-head">
        <span className="section-index" data-reveal>
          (05)
        </span>
        <h2 className="section-title" data-split>
          Study
        </h2>
        <p className="section-sub" data-reveal>
          Practice in public. Not my design, and labelled that way.
        </p>
      </header>

      <article className="study-card">
        <Shot src={STUDY.shot.src} alt={STUDY.shot.alt} />
        <div className="study-text">
          <h3 id="study-title" className="work-title" data-split>
            {STUDY.title}
          </h3>
          <p className="work-kind" data-reveal>
            {STUDY.kind}
          </p>
          <p className="work-summary" data-reveal>
            {STUDY.summary}
          </p>
          <dl className="work-meta" data-reveal>
            <div>
              <dt>Year</dt>
              <dd>{STUDY.year}</dd>
            </div>
            <div>
              <dt>Stack</dt>
              <dd>{STUDY.stack.join(' · ')}</dd>
            </div>
            <div>
              <dt>Live</dt>
              <dd>
                <a href={STUDY.link.href} target="_blank" rel="noreferrer" className="text-link">
                  {STUDY.link.label} <span aria-hidden="true">↗</span>
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </article>
    </section>
  )
}
