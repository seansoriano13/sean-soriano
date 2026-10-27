import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis = null

// Lenis drives the scroll; GSAP's ticker drives Lenis, so ScrollTrigger and
// the smoothed scroll position never disagree by a frame.
export function startSmoothScroll() {
  if (lenis) return lenis
  lenis = new Lenis({ autoRaf: false, lerp: 0.1 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)
  return lenis
}

function raf(time) {
  lenis?.raf(time * 1000)
}

export function stopSmoothScroll() {
  gsap.ticker.remove(raf)
  lenis?.destroy()
  lenis = null
}

export function scrollToTarget(target) {
  if (lenis) lenis.scrollTo(target, { duration: 1.6 })
  else if (typeof target === 'number') window.scrollTo({ top: target })
  else document.querySelector(target)?.scrollIntoView()
}

export function lockScroll(locked) {
  if (!lenis) return
  if (locked) lenis.stop()
  else lenis.start()
}
