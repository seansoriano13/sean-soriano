import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { WORKS } from '../data/content'
import { scrollToTarget } from '../lib/smoothScroll'
import { FINE_POINTER } from '../lib/parallax'

const preview = (w) => (w.shots ?? w.highlights)[0].src

// The Work Index: one row per Work. On hover a preview card trails the cursor,
// tilting with its speed while the screenshot inside leans the other way; the
// other rows step back.
export default function WorkIndex() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(`${FINE_POINTER} and (prefers-reduced-motion: no-preference)`, () => {
        const list = root.current
        const card = list.querySelector('.wi-preview')
        const pics = gsap.utils.toArray('.wi-pic', card)
        const rows = gsap.utils.toArray('.wi-row', list)

        const x = gsap.quickTo(card, 'x', { duration: 0.7, ease: 'power3.out' })
        const y = gsap.quickTo(card, 'y', { duration: 0.7, ease: 'power3.out' })
        const tilt = gsap.quickTo(card, 'rotation', { duration: 0.9, ease: 'power3.out' })
        const leanX = pics.map((p) => gsap.quickTo(p.firstChild, 'x', { duration: 1, ease: 'power3.out' }))
        const leanY = pics.map((p) => gsap.quickTo(p.firstChild, 'y', { duration: 1, ease: 'power3.out' }))
        const settle = gsap.delayedCall(0.12, () => tilt(0)).pause()

        let lastX = null
        let active = -1
        let z = 1

        const move = (e) => {
          const r = list.getBoundingClientRect()
          const px = e.clientX - r.left
          const py = e.clientY - r.top
          x(px)
          y(py)
          if (lastX !== null) tilt(gsap.utils.clamp(-8, 8, (e.clientX - lastX) * 0.6))
          lastX = e.clientX
          settle.restart(true)
          leanX.forEach((fn) => fn((px / r.width - 0.5) * -40))
          leanY.forEach((fn) => fn((py / r.height - 0.5) * -24))
        }
        const show = (i) => {
          if (i === active) return
          active = i
          rows.forEach((row, j) => row.classList.toggle('is-dim', j !== i))
          gsap.set(pics[i], { zIndex: ++z })
          gsap.fromTo(pics[i], { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'expo.out', overwrite: true })
          gsap.fromTo(pics[i].firstChild, { scale: 1.3 }, { scale: 1.1, duration: 1.1, ease: 'expo.out', overwrite: 'auto' })
        }
        const enter = (e) => {
          const r = list.getBoundingClientRect()
          gsap.set(card, { x: e.clientX - r.left, y: e.clientY - r.top })
          gsap.to(card, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'expo.out', overwrite: 'auto' })
        }
        const leave = () => {
          active = -1
          lastX = null
          rows.forEach((row) => row.classList.remove('is-dim'))
          gsap.to(card, { autoAlpha: 0, scale: 0.72, duration: 0.45, ease: 'power3.out', overwrite: 'auto' })
        }

        const onRow = rows.map((row, i) => {
          const fn = () => show(i)
          row.addEventListener('pointerenter', fn)
          return fn
        })
        list.addEventListener('pointerenter', enter)
        list.addEventListener('pointermove', move)
        list.addEventListener('pointerleave', leave)
        return () => {
          rows.forEach((row, i) => row.removeEventListener('pointerenter', onRow[i]))
          list.removeEventListener('pointerenter', enter)
          list.removeEventListener('pointermove', move)
          list.removeEventListener('pointerleave', leave)
        }
      })
    },
    { scope: root },
  )

  return (
    <div className="wi" ref={root}>
      <ol className="wi-list">
        {WORKS.map((w) => (
          <li key={w.id} className="wi-row" data-reveal>
            <a
              href={`#work-${w.id}`}
              onClick={(e) => {
                e.preventDefault()
                scrollToTarget(`#work-${w.id}`)
              }}
            >
              <span className="wi-num">{w.index}</span>
              <span className="wi-title">{w.title}</span>
              <span className="wi-kind">{w.kind.split(' — ')[0]}</span>
              <span className="wi-year">{w.year}</span>
              <span className="wi-arrow" aria-hidden="true">
                ↘
              </span>
            </a>
          </li>
        ))}
      </ol>
      <div className="wi-preview" aria-hidden="true">
        {WORKS.map((w) => (
          <span key={w.id} className="wi-pic">
            <img src={preview(w)} alt="" decoding="async" />
          </span>
        ))}
      </div>
    </div>
  )
}
