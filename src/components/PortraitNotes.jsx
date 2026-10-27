import { useEffect, useState } from 'react'
import { HERO, NOTES, PERSON } from '../data/content'
import { scrollToTarget } from '../lib/smoothScroll'

// "stage" sits around the portrait inside the Reveal on wide screens; "flow"
// is the same notes as ordinary content below it on portrait screens, where
// it also carries the Role Line and About that the stacked hero leaves out.
export default function PortraitNotes({ variant }) {
  const stage = variant === 'stage'
  return (
    <div className={`notes notes-${variant}`}>
      {!stage && (
        <div className="note note-about" data-note>
          <h2 className="note-label">{PERSON.role}</h2>
          <p className="note-about-text">{HERO.about}</p>
        </div>
      )}

      <div className="note note-stat note-stat-a" data-note>
        <span className="note-label">Proof</span>
        <Stat {...NOTES.stats[0]} animated={stage} />
      </div>
      <div className="note note-stat note-stat-b" data-note>
        <Stat {...NOTES.stats[1]} animated={stage} />
      </div>

      <div className="note note-stack" data-note>
        <span className="note-label">Stack</span>
        <ol className="stack-list">
          {NOTES.stack.map((s, i) => (
            <li key={s}>
              <span className="stack-index">{String(i + 1).padStart(2, '0')}</span>
              {s}
            </li>
          ))}
        </ol>
        <p className="note-body">{NOTES.stackNote}</p>
      </div>

      <div className="note note-design" data-note>
        <span className="note-label">{NOTES.design.title}</span>
        <p className="note-body">{NOTES.design.body}</p>
      </div>

      <div className="note note-strip" data-note>
        <span className="strip-where">
          {NOTES.location}
          <span className="strip-dot" aria-hidden="true">·</span>
          <PhtClock />
        </span>
        <span className="strip-avail">
          <span className="avail-dot" aria-hidden="true" />
          {NOTES.availability}
          <a
            href="#contact"
            className="strip-link"
            onClick={(e) => {
              e.preventDefault()
              scrollToTarget('#contact')
            }}
          >
            {NOTES.availabilityCta} <span aria-hidden="true">→</span>
          </a>
        </span>
      </div>
    </div>
  )
}

const format = (n) => Math.round(n).toLocaleString('en-US')

function Stat({ value, suffix, caption, animated }) {
  return (
    <>
      <span className="stat-value">
        <span data-count={animated ? value : undefined}>{format(value)}</span>
        {suffix}
      </span>
      <span className="stat-caption">{caption}</span>
    </>
  )
}

// Counts each stat up from zero on the Reveal's timeline, so it scrubs with scroll.
export function animateStats(tl, nodes, at) {
  nodes.forEach((node, i) => {
    const target = Number(node.dataset.count)
    const proxy = { n: 0 }
    tl.fromTo(
      proxy,
      { n: 0 },
      {
        n: target,
        duration: 1.3,
        ease: 'power2.out',
        onUpdate: () => (node.textContent = format(proxy.n)),
      },
      at + i * 0.22,
    )
  })
}

function PhtClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000)
    return () => clearInterval(id)
  }, [])
  const time = now.toLocaleTimeString('en-US', {
    timeZone: 'Asia/Manila',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  return (
    <time className="strip-clock" dateTime={now.toISOString()}>
      {time} PHT
    </time>
  )
}
