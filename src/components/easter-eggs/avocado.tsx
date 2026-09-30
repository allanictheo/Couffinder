/**
 * Le toast à l'avocat : boss de fin du combo de baston (gamer) et météo du
 * brunch (famille « Vie normale »). Dessin original.
 */
export function AvocadoToast({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 92" aria-hidden="true" className={className}>
      <path
        d="M10 40 C8 14 30 4 50 8 C70 4 92 14 90 40 C90 50 84 52 84 58 L84 86 L16 86 L16 58 C16 52 10 50 10 40 Z"
        fill="#d99b4a"
        stroke="#5c3510"
        strokeWidth={3.5}
      />
      <path d="M18 40 C17 20 34 13 50 16 C66 13 83 20 82 40 C82 48 77 50 77 56 L77 80 L23 80 L23 56 C23 50 18 48 18 40 Z" fill="#f4d79b" />
      {[
        [34, 48, -25],
        [50, 44, 0],
        [66, 48, 25],
      ].map(([cx, cy, angle]) => (
        <g key={cx} transform={`rotate(${angle} ${cx} ${cy})`}>
          <ellipse cx={cx} cy={cy} rx="9" ry="17" fill="#9ccc48" stroke="#3e6414" strokeWidth={2.5} />
          <ellipse cx={cx} cy={cy + 2} rx="5.5" ry="11" fill="#d3ec8a" />
        </g>
      ))}
      <g fill="#d7263d">
        <circle cx="42" cy="66" r="1.8" />
        <circle cx="58" cy="70" r="1.6" />
        <circle cx="30" cy="68" r="1.4" />
        <circle cx="70" cy="64" r="1.5" />
      </g>
      <g fill="#111">
        <circle cx="40" cy="30" r="3" />
        <circle cx="60" cy="30" r="3" />
      </g>
      <path d="M43 38 Q50 34 57 38" fill="none" stroke="#111" strokeWidth={2.5} strokeLinecap="round" />
    </svg>
  );
}
