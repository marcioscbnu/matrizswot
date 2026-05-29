import { getStatus } from "../utils/swotEngine";

export default function Score({ totals }) {
  const status = getStatus(totals.score);

  return (
    <section className="score-panel">
      <div className="score-main">
        <span className="score-label">Score SWOT</span>
        <strong>{totals.score}</strong>
        <span className="score-max">/100</span>
      </div>

      <div className={`status-pill ${status.className}`}>
        <span>{status.emoji}</span>
        <strong>{status.label}</strong>
      </div>

      <div className="bar-area">
        <div className="bar-scale">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
        <div className="progress-bar">
          <div className={`progress-fill ${status.className}`} style={{ width: `${totals.score}%` }} />
          <div className="marker" style={{ left: `${totals.score}%` }}>▲</div>
        </div>
      </div>

      <p className="status-message">{status.message}</p>

      <div className="mini-kpis">
        <div>
          <span>Positivos</span>
          <strong>{totals.positivos}</strong>
        </div>
        <div>
          <span>Negativos</span>
          <strong>{totals.negativos}</strong>
        </div>
        <div>
          <span>Risco</span>
          <strong>{totals.risco}%</strong>
        </div>
      </div>
    </section>
  );
}
