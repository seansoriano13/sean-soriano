// Sean's glasses mark, from his own portfolio-logo.svg: a steady lens ("order"),
// a slightly tilted, compressed one ("anxiety"), an uneven bridge and a faded
// temple line. Drawn in currentColor, cropped to the glasses, and a touch
// heavier than the 200px original so it holds at nav size.
export default function Mark({ className, strokeWidth = 2.6, title }) {
  return (
    <svg
      className={className}
      viewBox="7 31 81 43"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <circle cx="32" cy="50" r="16" />
      <ellipse cx="70" cy="55" rx="14.5" ry="15.5" transform="rotate(4 70 55)" />
      <path d="M48 49.5L55.5 53.5" />
      <path d="M16 50H10" opacity="0.4" />
    </svg>
  )
}
