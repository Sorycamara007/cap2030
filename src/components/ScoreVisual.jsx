export default function ScoreVisual({ score = 0, niveau = '', justification = '' }) {
  const safe = Math.max(0, Math.min(100, Number(score) || 0))
  const pct = safe / 100

  // SVG arc geometry
  const size = 220
  const stroke = 6
  const r = (size - stroke) / 2
  const cx = size / 2
  const cy = size / 2
  const circ = 2 * Math.PI * r
  const dash = circ * pct

  return (
    <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-10 md:gap-14 items-start">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#E6DFD2"
            strokeWidth={stroke}
          />
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#B8945F"
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeLinecap="butt"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-display text-navy text-6xl leading-none">{safe}</div>
          <div className="text-xs uppercase tracking-wider2 text-navy/50 mt-2">
            / 100
          </div>
        </div>
      </div>

      <div className="pt-4">
        <div className="label-eyebrow-gold mb-3">Alignement CAP 2030</div>
        <div className="font-display text-navy text-3xl md:text-4xl capitalize mb-6 leading-tight">
          {niveau || '—'}
        </div>
        <div className="rule-gold mb-6" />
        <p className="font-serif text-navy/85 text-base md:text-lg leading-relaxed max-w-prose2">
          {justification}
        </p>
      </div>
    </div>
  )
}
