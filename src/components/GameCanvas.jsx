function GameCanvas({ crashAt, gameState, multiplier }) {
  const isCrashed = gameState === "CRASHED";
  const progress = Math.min(Math.max((multiplier - 1) / 4, 0), 1);
  const planeX = 10 + progress * 76;
  const planeY = 80 - Math.pow(progress, 0.72) * 56;
  const rotation = isCrashed ? 24 : -8 - progress * 16;

  return (
    <section className={`flight-stage ${isCrashed ? "is-crashed" : ""}`}>
      <svg
        aria-label="Live flight path"
        className="flight-canvas"
        role="img"
        viewBox="0 0 100 100"
      >
        <defs>
          <linearGradient id="trailGradient" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#35d07f" />
            <stop offset="52%" stopColor="#3bb8ff" />
            <stop offset="100%" stopColor="#ff4e58" />
          </linearGradient>
        </defs>

        <g className="grid-lines">
          <path d="M8 22H94" />
          <path d="M8 42H94" />
          <path d="M8 62H94" />
          <path d="M8 82H94" />
          <path d="M22 12V88" />
          <path d="M44 12V88" />
          <path d="M66 12V88" />
          <path d="M88 12V88" />
        </g>

        <path
          className="flight-path"
          d="M8 82 C 24 78, 36 62, 49 51 S 74 28, 92 19"
        />
        <path
          className="flight-trail"
          d={`M8 82 C 24 78, 36 62, ${Math.max(49, planeX)} ${Math.min(
            82,
            planeY + 10,
          )}`}
        />

        <g
          className="aircraft"
          transform={`translate(${planeX} ${planeY}) rotate(${rotation})`}
        >
          <path
            className="aircraft-body"
            d="M-11 2 L14 -4 C17 -4 18 -2 16 0 L1 9 L-3 17 L-7 18 L-5 8 L-16 6 Z"
          />
          <path className="aircraft-wing" d="M-2 4 L-15 -9 L-8 -10 L7 0 Z" />
          <path className="aircraft-tail" d="M-10 3 L-18 -6 L-13 -7 L-4 1 Z" />
          <path className="aircraft-flame" d="M-15 4 L-24 1 L-15 -2 Z" />
        </g>
      </svg>

      <div className="stage-readout">
        <span>{gameState}</span>
        <strong>{isCrashed && crashAt ? `${crashAt.toFixed(2)}x` : "Live"}</strong>
      </div>
    </section>
  );
}

export default GameCanvas;
