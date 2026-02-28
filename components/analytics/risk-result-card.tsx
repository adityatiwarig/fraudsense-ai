"use client"

import { AlertTriangle, CheckCircle2, Shield, TrendingUp, Brain } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface RiskResult {
  score: number
  confidence: "Low" | "Medium" | "High"
  category: string
  redFlags: string[]
  recommendations: string[]
  breakdown: {
    aiProbability: number
    keywordScore: number
    frequencyScore: number
    urlScore: number | null
  }
  aiReasoning: string
  aiSource?: "gemini" | "heuristic"
}

function getScoreColor(score: number) {
  if (score >= 70) return "#ef4444"
  if (score >= 40) return "#f59e0b"
  return "#10b981"
}

function getScoreLabel(score: number) {
  if (score >= 70) return "High Risk"
  if (score >= 40) return "Medium Risk"
  return "Low Risk"
}

function getScoreBadgeClass(score: number) {
  if (score >= 70) return "border-destructive/30 bg-destructive/10 text-destructive"
  if (score >= 40) return "border-warning/30 bg-warning/10 text-warning"
  return "border-success/30 bg-success/10 text-success"
}

export function RiskResultCard({ result }: { result: RiskResult }) {
  const scoreColor = getScoreColor(result.score)
  const hasUrl = result.breakdown.urlScore != null

  const breakdownItems = hasUrl
    ? [
        { label: "AI Analysis", value: result.breakdown.aiProbability, weight: "40%" },
        { label: "URL Risk", value: result.breakdown.urlScore!, weight: "35%" },
        { label: "Keyword Match", value: result.breakdown.keywordScore, weight: "15%" },
        { label: "Pattern Score", value: result.breakdown.frequencyScore, weight: "10%" },
      ]
    : [
        { label: "AI Analysis", value: result.breakdown.aiProbability, weight: "60%" },
        { label: "Keyword Match", value: result.breakdown.keywordScore, weight: "20%" },
        { label: "Pattern Score", value: result.breakdown.frequencyScore, weight: "20%" },
      ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card overflow-hidden rounded-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-cyan" />
          <span className="text-sm font-medium text-foreground">Analysis Complete</span>
          {result.aiSource && (
            <span className="rounded-md border border-border bg-secondary px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
              {result.aiSource === "gemini" ? "Gemini AI" : "Heuristic Engine"}
            </span>
          )}
        </div>
        <Badge className={getScoreBadgeClass(result.score)}>
          {getScoreLabel(result.score)}
        </Badge>
      </div>

      <div className="p-6">
        {/* Score display */}
        <div className="mb-6 flex items-center gap-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.2 }}
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${scoreColor}15` }}
          >
            <span className="text-4xl font-bold" style={{ color: scoreColor }}>
              {result.score}
            </span>
          </motion.div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-foreground">
              Risk Score: {result.score}/100
            </p>
            <p className="text-xs text-muted-foreground">
              Category: {result.category}
            </p>
            <p className="text-xs text-muted-foreground">
              Confidence: {result.confidence}
            </p>
          </div>
        </div>

        {/* Risk bar */}
        <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${result.score}%` }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(to right, #10b981, #f59e0b, ${scoreColor})`,
            }}
          />
        </div>

        {/* AI Reasoning */}
        {result.aiReasoning && (
          <div className="mb-6 rounded-xl border border-cyan/10 bg-cyan/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Brain className="h-4 w-4 text-cyan" />
              <p className="text-xs font-medium uppercase tracking-wider text-cyan">
                AI Reasoning
              </p>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {result.aiReasoning}
            </p>
          </div>
        )}

        {/* Score breakdown */}
        <div className={`mb-6 grid gap-4 ${hasUrl ? "grid-cols-4" : "grid-cols-3"}`}>
          {breakdownItems.map((item) => (
            <div key={item.label} className="rounded-lg bg-secondary/50 p-3 text-center">
              <p className="text-lg font-bold text-foreground">{item.value}</p>
              <p className="text-[10px] text-muted-foreground">{item.label}</p>
              <p className="text-[10px] text-cyan">Weight: {item.weight}</p>
            </div>
          ))}
        </div>

        {/* Red flags */}
        {result.redFlags.length > 0 && (
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Red Flags Detected ({result.redFlags.length})
              </p>
            </div>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
              {result.redFlags.map((flag, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="flex items-start gap-2"
                >
                  <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-warning" />
                  <span className="text-sm text-muted-foreground">{flag}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="rounded-xl border border-success/10 bg-success/5 p-4">
          <div className="mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <p className="text-sm font-medium text-foreground">Recommendations</p>
          </div>
          <div className="flex flex-col gap-1.5">
            {result.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-2">
                <TrendingUp className="mt-0.5 h-3 w-3 shrink-0 text-success/60" />
                <span className="text-xs text-muted-foreground">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
