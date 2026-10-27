import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { coverGeometry } from '../lib/frames'
import { PERSON } from '../data/content'
import Mark from './Mark'

gsap.registerPlugin(useGSAP)

// Counts the frames in, then opens from the sound hole onto the first frame.
export default function Loader({ progress, ready, frameSet, onExit }) {
  const root = useRef(null)
  const count = useRef(null)
  const bar = useRef(null)
  const shown = useRef({ v: 0 })

  const paint = () => {
    const v = shown.current.v
    if (count.current) count.current.textContent = String(Math.round(v)).padStart(2, '0')
    if (bar.current) bar.current.style.transform = `scaleX(${v / 100})`
  }

  useGSAP(
    () => {
      gsap.to(shown.current, { v: progress * 100, duration: 0.8, ease: 'power2.out', onUpdate: paint, overwrite: true })
    },
    { dependencies: [progress] },
  )

  useGSAP(
    () => {
      if (!ready) return
      const el = root.current
      const geo = coverGeometry(frameSet, window.innerWidth, window.innerHeight)
      el.style.setProperty('--lx', `${geo.hx}px`)
      el.style.setProperty('--ly', `${geo.hy}px`)
      const far = Math.hypot(window.innerWidth, window.innerHeight)

      const tl = gsap.timeline({ delay: 0.25 })
      tl.to(shown.current, { v: 100, duration: 0.6, ease: 'power2.out', onUpdate: paint, overwrite: true })
      tl.to('.loader-inner', { autoAlpha: 0, y: -16, duration: 0.5, ease: 'power2.in' })
      tl.fromTo(el, { '--r': '0px' }, { '--r': `${geo.hr}px`, duration: 0.9, ease: 'expo.out' })
      tl.add(onExit, '-=0.35')
      tl.to(el, { '--r': `${far}px`, duration: 1.1, ease: 'power3.in' }, '-=0.1')
      tl.set(el, { display: 'none' })
    },
    { scope: root, dependencies: [ready] },
  )

  return (
    <div ref={root} className="loader" role="status" aria-live="polite" aria-label="Loading">
      <div className="loader-inner">
        <Mark className="loader-mark" title={PERSON.name} />
        <span className="loader-count">
          <span ref={count}>00</span>
          <span className="loader-pct">%</span>
        </span>
        <span className="loader-track">
          <span ref={bar} className="loader-bar" />
        </span>
        <span className="loader-hint">Tuning up</span>
      </div>
    </div>
  )
}
