"use client"

export function RiskGauge({ score = 64 }: { score?: number }) {
  const circumference = 2 * Math.PI * 54
  const strokeDashoffset = circumference - (score / 100) * circumference * 0.75
  const rotation = -225

  const getColor = (s: number) => {
    if (s < 30) return "#10b981"
    if (s < 60) return "#f59e0b"
    return "#ef4444"
  }

  const getLabel = (s: number) => {
    if (s < 30) return "Low Risk"
    if (s < 60) return "Medium Risk"
    return "High Risk"
  }

  return (
    <div className="glass-card flex flex-col items-center rounded-xl p-5">
      <h3 className="mb-1 text-sm font-semibold text-foreground">Overall Risk Level</h3>
      <p className="mb-4 text-xs text-muted-foreground">Current aggregate score</p>

      <div className="relative mb-3">
        <svg width="140" height="110" viewBox="0 0 140 110">
          {/* Background arc */}
          <circle
            cx="70"
            cy="70"
            r="54"
            fill="none"
            stroke="rgba(6,214,242,0.08)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
            transform={`rotate(${rotation} 70 70)`}
          />
          {/* Foreground arc */}
          <circle
            cx="70"
            cy="70"
            r="54"
            fill="none"
            stroke={getColor(score)}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(${rotation} 70 70)`}
            style={{ transition: "stroke-dashoffset 1.5s ease-out, stroke 0.5s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <span className="text-3xl font-bold" style={{ color: getColor(score) }}>
            {score}
          </span>
        </div>
      </div>
      <span
        className="text-xs font-medium"
        style={{ color: getColor(score) }}
      >
        {getLabel(score)}
      </span>
    </div>
  )
}
