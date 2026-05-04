function Multiplier({ connected, crashAt, gameState, multiplier }) {
  const isCrashed = gameState === "CRASHED";
  const label = !connected ? "Offline" : isCrashed ? "Crashed" : "Flying";

  return (
    <section className={`multiplier-panel ${isCrashed ? "crashed" : ""}`}>
      <div>
        <span className="eyebrow">{label}</span>
        <p className="multiplier-value">{multiplier.toFixed(2)}x</p>
      </div>
      <div className="crash-readout">
        <span>Crash</span>
        <strong>{crashAt ? `${crashAt.toFixed(2)}x` : "--"}</strong>
      </div>
    </section>
  );
}

export default Multiplier;
