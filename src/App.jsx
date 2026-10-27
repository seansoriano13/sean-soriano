import { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import Loader from './components/Loader'
import Nav from './components/Nav'
import Dive from './components/Dive'
import PortraitNotes from './components/PortraitNotes'
import Work from './components/Work'
import Services from './components/Services'
import Process from './components/Process'
import Toolbox from './components/Toolbox'
import Study from './components/Study'
import Path from './components/Path'
import Contact from './components/Contact'
import { loadFrames, pickFrameSet } from './lib/frames'
import { lockScroll, startSmoothScroll, stopSmoothScroll } from './lib/smoothScroll'
import { FINE_POINTER, pointerParallax } from './lib/parallax'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)
ScrollTrigger.config({ ignoreMobileResize: true })

const REDUCED = '(prefers-reduced-motion: reduce)'
const FLOW_REVEALS = 'main [data-reveal], .notes-flow [data-note]'

export default function App() {
  const [reduced] = useState(() => window.matchMedia(REDUCED).matches)
  const [frameSet] = useState(pickFrameSet)
  const [progress, setProgress] = useState(0)
  const [frames, setFrames] = useState(null)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    let live = true
    Promise.all([loadFrames(frameSet, (p) => live && setProgress(p)), document.fonts.ready]).then(
      ([images]) => live && setFrames(images),
    )
    return () => {
      live = false
    }
  }, [frameSet])

  useEffect(() => {
    if (reduced) return
    startSmoothScroll()
    lockScroll(true)
    return stopSmoothScroll
  }, [reduced])

  useEffect(() => {
    document.documentElement.classList.toggle('motion-reduce', reduced)
    document.documentElement.classList.toggle('is-loading', !entered)
    if (entered) {
      lockScroll(false)
      ScrollTrigger.refresh()
    }
  }, [entered, reduced])

  return (
    <>
      <Loader progress={progress} ready={!!frames} frameSet={frameSet} onExit={() => setEntered(true)} />
      <Nav entered={entered} reduced={reduced} />
      <main>
        <Dive frames={frames} frameSet={frameSet} entered={entered} reduced={reduced} />
        <PortraitNotes variant="flow" />
        <Reveals ready={entered} reduced={reduced} />
        <Work />
        <Services />
        <Process />
        <Toolbox />
        <Study />
        <Path />
        <Contact />
      </main>
    </>
  )
}

// Scroll-in motion for everything below the Dive: text rises, titles come up
// line by line from behind a mask, screenshots unclip and drift through their
// bleed, and anything marked [data-parallax] leans with the cursor.
function Reveals({ ready, reduced }) {
  useGSAP(
    () => {
      if (!ready || reduced) return

      const mm = gsap.matchMedia()
      mm.add(FINE_POINTER, () => {
        const off = gsap.utils.toArray('[data-parallax]').map(pointerParallax)
        return () => off.forEach((fn) => fn())
      })

      gsap.utils.toArray('[data-split]').forEach((el) => {
        SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.3,
              stagger: 0.08,
              ease: 'expo.out',
              scrollTrigger: { trigger: el, start: 'top 88%' },
            }),
        })
      })

      ScrollTrigger.batch(FLOW_REVEALS, {
        start: 'top 90%',
        once: true,
        onEnter: (els) =>
          gsap.fromTo(els, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08, ease: 'power3.out' }),
      })
      gsap.set(FLOW_REVEALS, { autoAlpha: 0 })

      gsap.utils.toArray('[data-clip]').forEach((fig) => {
        const img = fig.querySelector('img')
        gsap.fromTo(
          fig,
          { clipPath: 'inset(12% 6% 12% 6% round 18px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 14px)',
            ease: 'power2.out',
            scrollTrigger: { trigger: fig, start: 'top 95%', end: 'top 45%', scrub: true },
          },
        )
        gsap.fromTo(
          img,
          { yPercent: -4 },
          { yPercent: 4, ease: 'none', scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true } },
        )
      })
    },
    { dependencies: [ready, reduced] },
  )
  return null
}
