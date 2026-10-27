import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { FILL_FRAME, FRAME_COUNT, WHITE_FRAME, coverGeometry, holeShift, nearestFrame, zoomAt } from '../lib/frames'
import { scrollToTarget } from '../lib/smoothScroll'
import { HERO, NOTES, PERSON } from '../data/content'
import PortraitNotes, { animateStats } from './PortraitNotes'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Wide screens put the Headlines beside the sound hole; portrait screens stack
// them above and below it. Kept in step with the same query in styles.css.
export const SIDE_LAYOUT = '(min-aspect-ratio: 11/10) and (min-width: 768px)'

// Headline corners sit this far out along the hole's diagonal, in hole radii,
// so every line starts over the wood and, zooming with the footage, stays there.
const ANCHOR = 0.74
const LINE_HEIGHT = 0.92
const NAV_CLEARANCE = 92
const INK = '#141210'
const IVORY = '#F6F4EF'

// The Dive's frames play over the first 6 of the timeline's 10 units; the
// rest is the Reveal. Hero Text timings follow the footage: everything is off
// the wood by the frame where the hole fills the width.
const DIVE = 6
const timeOf = (frame) => (frame / (FRAME_COUNT - 1)) * DIVE
const T_FILL = timeOf(FILL_FRAME)
const T_REVEAL = timeOf(WHITE_FRAME) - 0.5

export default function Dive({ frames, frameSet, entered, reduced }) {
  const root = useRef(null)
  const canvas = useRef(null)
  const layer = useRef(null)

  // Draws the frame and sizes the Hero Text around the hole; re-run on every refresh.
  useGSAP(
    () => {
      if (!frames) return
      const el = root.current
      const ctx = canvas.current.getContext('2d')
      const state = { frame: 0 }
      const logo = document.querySelector('.nav-logo')
      const nav = document.querySelector('.nav')
      let geo
      let logoStart
      let dpr = 1

      const lineEm = measureHeadlineEm(el)

      const draw = () => {
        const img = nearestFrame(frames, Math.round(state.frame))
        if (!img?.naturalWidth) return
        ctx.drawImage(img, geo.ox * dpr, geo.oy * dpr, geo.dw * dpr, geo.dh * dpr)
      }

      const render = () => {
        draw()
        if (reduced) return
        // Zoom with the footage about the hole, and follow the hole as the camera tilts.
        const shift = holeShift(frameSet, geo, state.frame)
        layer.current.style.transform = `translate(${shift.x}px, ${shift.y}px) scale(${zoomAt(state.frame)})`
      }

      const layout = () => {
        const vw = el.clientWidth
        const vh = window.innerHeight
        dpr = Math.min(window.devicePixelRatio || 1, 2)
        canvas.current.width = Math.round(vw * dpr)
        canvas.current.height = Math.round(vh * dpr)
        // Resizing resets the context; the frames are scaled up, so ask for the better filter.
        ctx.imageSmoothingQuality = 'high'
        geo = coverGeometry(frameSet, vw, vh)

        const m = Math.max(20, vw * 0.06)
        const side = window.matchMedia(SIDE_LAYOUT).matches
        let fs
        if (side) {
          const room = geo.hx - geo.hr * ANCHOR - m
          const above = geo.hy - geo.hr * ANCHOR - NAV_CLEARANCE
          fs = Math.min(room / lineEm, above / (2 * LINE_HEIGHT), 150)
        } else {
          const above = geo.hy - geo.hr - 14 - NAV_CLEARANCE * 0.7
          const below = vh - (geo.hy + geo.hr + 14) - 96
          fs = Math.min((vw - 2 * m) / lineEm, above / (2 * LINE_HEIGHT), below / (2 * LINE_HEIGHT), 76)
        }

        const s = el.style
        s.setProperty('--hx', `${geo.hx}px`)
        s.setProperty('--hy', `${geo.hy}px`)
        s.setProperty('--hr', `${geo.hr}px`)
        s.setProperty('--m', `${m}px`)
        s.setProperty('--hfs', `${Math.max(fs, 30)}px`)
        s.setProperty('--anchor', ANCHOR)
        layer.current.style.transformOrigin = `${geo.hx}px ${geo.hy}px`

        // Where the Logo sits in the hole before it docks into the nav: about
        // two thirds of the hole's width, between the strings.
        if (!reduced) {
          gsap.set(logo, { x: 0, y: 0, scale: 1 })
          const r = logo.getBoundingClientRect()
          logoStart = {
            x: geo.hx - (r.left + r.width / 2),
            y: geo.hy - (r.top + r.height / 2),
            scale: Math.min((geo.hr * 1.3) / r.width, 4.5),
          }
        }
        render()
      }

      layout()

      if (reduced) {
        window.addEventListener('resize', layout)
        return () => window.removeEventListener('resize', layout)
      }

      ScrollTrigger.addEventListener('refreshInit', layout)
      const vw = () => el.clientWidth

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: '+=520%',
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onRefresh: render,
          // Once the Dive lets go, the nav sits over content and needs a backdrop.
          onLeave: () => nav.classList.add('nav-solid'),
          onEnterBack: () => nav.classList.remove('nav-solid'),
        },
      })

      // The Dive itself.
      tl.to(state, { frame: FRAME_COUNT - 1, duration: DIVE, onUpdate: render }, 0)

      // Hero Text rides the footage's zoom (in render) and drifts apart, like
      // passing between the two lines.
      tl.to('.headline-a', { x: () => -vw() * 0.1, duration: T_FILL }, 0)
      tl.to('.headline-b', { x: () => vw() * 0.1, duration: T_FILL }, 0)
      tl.to('.hero-cta', { autoAlpha: 0, y: 20, duration: 0.5 }, 0)
      tl.to('.hero-about, .hero-cue', { autoAlpha: 0, duration: T_FILL * 0.25 }, T_FILL * 0.4)
      tl.to('.headline', { autoAlpha: 0, duration: 0.5 }, T_FILL - 0.5)
      tl.to('.dive-vignette', { autoAlpha: 0, duration: T_FILL * 0.8 }, T_FILL * 0.25)

      // The Logo holds in the hole for the first stretch of the approach, then
      // leaves it and settles into the nav.
      const LOGO_HOLD = T_FILL * 0.3
      tl.fromTo(
        logo,
        { x: () => logoStart.x, y: () => logoStart.y, scale: () => logoStart.scale },
        { x: 0, y: 0, scale: 1, duration: 3, ease: 'power2.inOut', immediateRender: true },
        LOGO_HOLD,
      )
      tl.fromTo(nav, { '--nav-fg': IVORY }, { '--nav-fg': INK, duration: T_FILL * 0.3 }, T_FILL * 0.65)

      // Reveal: the white settles into Premium White and the portrait pulls into focus.
      tl.to('.dive-white', { autoAlpha: 1, duration: 0.9 }, T_REVEAL - 0.2)
      tl.fromTo(
        '.portrait',
        { autoAlpha: 0, scale: 1.32, filter: 'blur(26px)' },
        { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 2.3, ease: 'power2.out' },
        T_REVEAL,
      )
      tl.fromTo(
        '.behind',
        { autoAlpha: 0, scale: 1.12 },
        { autoAlpha: 1, scale: 1, duration: 2, ease: 'power2.out' },
        T_REVEAL + 0.8,
      )
      tl.from('.reveal-stage [data-note]', { autoAlpha: 0, y: 36, stagger: 0.22, duration: 0.9, ease: 'power3.out' }, T_REVEAL + 1.8)
      animateStats(tl, el.querySelectorAll('.reveal-stage [data-count]'), T_REVEAL + 1.9)
      tl.to({}, { duration: 0.6 }, 9.4)

      return () => {
        ScrollTrigger.removeEventListener('refreshInit', layout)
        gsap.set(logo, { clearProps: 'transform' })
      }
    },
    { scope: root, dependencies: [frames, frameSet, reduced] },
  )

  // Intro, once the loader has opened the hole.
  useGSAP(
    () => {
      if (!entered) return
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from('.headline .line-inner', { yPercent: 115, duration: 1.4, stagger: 0.09 }, 0.15)
      tl.from('.intro-fade', { autoAlpha: 0, y: 18, duration: 1.2, stagger: 0.1 }, 0.5)
    },
    { scope: root, dependencies: [entered] },
  )

  return (
    <section ref={root} className="dive" aria-label="Introduction">
      <div className="dive-frame">
        <canvas ref={canvas} className="dive-canvas" aria-hidden="true" />
        <div className="dive-vignette" aria-hidden="true" />

        <div ref={layer} className="hero-layer">
          <h1 className="sr-only">
            {PERSON.name}, {PERSON.role}
          </h1>
          <p className="headline headline-a">
            {HERO.headlineA.map((line) => (
              <span key={line} className="line">
                <span className="line-inner">{line}</span>
              </span>
            ))}
          </p>
          <p className="headline headline-b">
            {HERO.headlineB.map((line) => (
              <span key={line} className="line">
                <span className="line-inner">{line}</span>
              </span>
            ))}
          </p>

          <div className="hero-about">
            <div className="intro-fade">
              <h2 className="hero-role">{PERSON.role}</h2>
              <span className="hero-rule" />
              <p className="hero-about-text">{HERO.about}</p>
            </div>
          </div>

          <div className="hero-cue">
            <div className="intro-fade">
              <span className="hero-rule-long" />
              <div className="hero-cue-labels">
                <span>{HERO.scrollCue[0]}</span>
                <span>{HERO.scrollCue[1]}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-cta">
          <div className="intro-fade">
            <a
              href="#work"
              className="pill"
              onClick={(e) => {
                e.preventDefault()
                scrollToTarget('#work')
              }}
            >
              <span className="pill-label">{HERO.cta}</span>
              <span className="pill-icon" aria-hidden="true">
                <svg viewBox="0 0 16 16" width="14" height="14">
                  <path d="M8 2v11M3 8.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className="dive-white" aria-hidden="true" />

      <div className="reveal-stage" id="about">
        <p className="behind" aria-hidden="true">
          {NOTES.behind.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </p>
        <img className="portrait" src="/img/portrait.webp" alt="Sean Soriano in a dark suit and red tie" width="1024" height="1536" />
        <PortraitNotes variant="stage" />
      </div>
    </section>
  )
}

// Width of the widest Headline line, per pixel of font size.
function measureHeadlineEm(scope) {
  const probe = document.createElement('span')
  probe.className = 'headline-probe'
  scope.appendChild(probe)
  let widest = 0
  for (const line of [...HERO.headlineA, ...HERO.headlineB]) {
    probe.textContent = line
    widest = Math.max(widest, probe.getBoundingClientRect().width)
  }
  probe.remove()
  return widest / 100
}
