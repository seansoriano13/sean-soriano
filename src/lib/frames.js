import zoom from '../data/zoom.json'

// The upscaled take of the Dive: 208 frames, from inside the body until the
// picture is white. zoom.json holds what was measured on every frame.
export const FRAME_COUNT = zoom.frames

// Three cuts of the same frames. `fullWidth` is the full frame's width at the
// cut's scale, so the hole measures the same in all of them; the phone cut is
// an 810px-wide centre crop of the 1920 frame, for portrait screens.
const SETS = {
  hd: { dir: '/frames/hd', width: 2560, height: 1440, fullWidth: 2560 },
  d: { dir: '/frames/d', width: 1920, height: 1080, fullWidth: 1920 },
  m: { dir: '/frames/m', width: 810, height: 1080, fullWidth: 1920 },
}

export function pickFrameSet() {
  const { innerWidth: w, innerHeight: h, devicePixelRatio: dpr = 1 } = window
  if (w / h < 0.9) return SETS.m
  return w * dpr > 2200 ? SETS.hd : SETS.d
}

const frameUrl = (set, i) => `${set.dir}/${String(i + 1).padStart(3, '0')}.webp`

// Every fourth frame first, so the Dive can open after a quarter of the
// download; the rest fill in behind it. Resolves with the (still filling)
// array once that first pass is in.
export function loadFrames(set, onProgress) {
  const images = Array(FRAME_COUNT).fill(null)
  const load = (i) => {
    const img = new Image()
    img.decoding = 'async'
    img.src = frameUrl(set, i)
    return img
      .decode()
      .then(() => (images[i] = img))
      .catch(() => {})
  }
  const first = []
  for (let i = 0; i < FRAME_COUNT; i += 4) first.push(i)
  if (first.at(-1) !== FRAME_COUNT - 1) first.push(FRAME_COUNT - 1)

  let done = 0
  return Promise.all(first.map((i) => load(i).then(() => onProgress(++done / first.length)))).then(() => {
    for (let i = 0; i < FRAME_COUNT; i++) if (!first.includes(i)) load(i)
    return images
  })
}

// The loaded frame closest to `i`.
export function nearestFrame(images, i) {
  for (let d = 0; d < images.length; d++) {
    if (images[i - d]) return images[i - d]
    if (images[i + d]) return images[i + d]
  }
  return null
}

// Where the frame lands when drawn to cover a viewport, and where the sound
// hole sits in viewport pixels in frame 1.
export function coverGeometry(set, vw, vh) {
  const k = Math.max(vw / set.width, vh / set.height)
  const dw = set.width * k
  const dh = set.height * k
  const ox = (vw - dw) / 2
  const oy = (vh - dh) / 2
  return {
    k, dw, dh, ox, oy,
    hx: ox + dw / 2 + (zoom.cx[0] - 0.5) * set.fullWidth * k,
    hy: oy + dh * zoom.cy[0],
    hr: ((zoom.holeDiameter * set.fullWidth) / 2) * k,
  }
}

const lerpAt = (series, frame) => {
  const i = Math.min(Math.floor(frame), series.length - 1)
  const j = Math.min(i + 1, series.length - 1)
  return series[i] + (series[j] - series[i]) * (frame - i)
}

// How much the footage has zoomed in at a (fractional) frame, relative to frame 1.
export const zoomAt = (frame) => lerpAt(zoom.scale, frame)

// How far the hole's centre has drifted from frame 1, in viewport pixels:
// the camera tilts slightly as it pushes in.
export function holeShift(set, geo, frame) {
  return {
    x: (lerpAt(zoom.cx, frame) - zoom.cx[0]) * set.fullWidth * geo.k,
    y: (lerpAt(zoom.cy, frame) - zoom.cy[0]) * set.height * geo.k,
  }
}

// The frames the Dive is timed against: the hole fills the width, the picture is white.
export const FILL_FRAME = zoom.fillFrame
export const WHITE_FRAME = Math.min(zoom.whiteFrame, FRAME_COUNT - 1)
