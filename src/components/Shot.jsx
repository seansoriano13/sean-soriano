// A screenshot in its frame. The frame unclips as it scrolls in (data-clip);
// inside it the picture leans toward the cursor on hover (.shot-pan) and drifts
// through its bleed as you scroll (the img itself), so the two never fight.
export default function Shot({ src, alt, className = '' }) {
  return (
    <figure className={`shot ${className}`} data-clip data-parallax>
      <span className="shot-pan" data-depth="-14" data-zoom="0.03">
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </span>
    </figure>
  )
}
