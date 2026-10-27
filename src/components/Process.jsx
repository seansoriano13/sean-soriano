import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { CHECKER, PROCESS } from '../data/content'

// The Process, four steps on a rail that fills as you read down it. The last
// step is the release check, and the one place this site points at Pea's.
export default function Process() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.process-fill',
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: '.process-list', start: 'top 70%', end: 'bottom 60%', scrub: true },
          },
        )
        gsap.utils.toArray('.process-step').forEach((step) =>
          gsap.fromTo(
            step.querySelector('.process-num'),
            { color: 'rgb(20 18 16 / 0.18)' },
            { color: 'rgb(20 18 16 / 1)', duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: step, start: 'top 62%', toggleActions: 'play none none reverse' } },
          ),
        )
      })
    },
    { scope: root },
  )

  return (
    <section id="process" ref={root} className="section process" aria-labelledby="process-title">
      <header className="section-head">
        <span className="section-index" data-reveal>
          (03)
        </span>
        <h2 id="process-title" className="section-title" data-split>
          Process
        </h2>
        <p className="section-sub" data-reveal>
          How I build, from the first conversation to the release.
        </p>
      </header>

      <div className="process-wrap">
        <span className="process-rail" aria-hidden="true">
          <span className="process-fill" />
        </span>
        <ol className="process-list">
          {PROCESS.map((p, i) => (
            <li key={p.title} className="process-step">
              <span className="process-num">{String(i + 1).padStart(2, '0')}</span>
              <div className="process-text" data-reveal>
                <h3 className="process-title">{p.title}</h3>
                <p className="process-body">{p.body}</p>
                {p.checker && (
                  <a href={CHECKER.href} target="_blank" rel="noreferrer" className="process-checker">
                    <span className="text-link">
                      Checked by {CHECKER.name}, {CHECKER.role}
                    </span>{' '}
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
