import './ScoreCard.css'

function getScoreColor(score) {
  if (score >= 75) return 'var(--color-success)'
  if (score >= 50) return 'var(--color-warning)'
  return 'var(--color-danger)'
}

function ScoreCard({ score }) {
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0))
  const radius = 80
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (safeScore / 100) * circumference
  const color = getScoreColor(safeScore)

  return (
    <div className="score-card">
      <p className="score-card__label">Resume Match Score</p>
      <div className="score-card__ring-wrap">
        <svg className="score-card__ring" viewBox="0 0 200 200">
          <circle
            className="score-card__track"
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            strokeWidth="14"
          />
          <circle
            className="score-card__progress"
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            strokeWidth="14"
            strokeLinecap="round"
            style={{
              stroke: color,
              strokeDasharray: circumference,
              strokeDashoffset: offset,
            }}
          />
        </svg>
        <div className="score-card__value">
          <span className="score-card__number">{safeScore}</span>
          <span className="score-card__denominator">/100</span>
        </div>
      </div>
    </div>
  )
}

export default ScoreCard
