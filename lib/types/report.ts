export interface ReportBreakdown {
  aiProbability: number
  keywordScore: number
  frequencyScore: number
  urlScore: number | null
}

export interface ReportItem {
  id: string
  content: string
  score: number
  status: "Active" | "Resolved"
  confidence: "Low" | "Medium" | "High"
  category: string
  redFlags: string[]
  recommendations: string[]
  breakdown: ReportBreakdown
  createdAt: string
}

export interface ReportStats {
  total: number
  high: number
  medium: number
  low: number
  avgScore: number
}

export interface NotificationPrefs {
  highRiskAlerts: boolean
  weeklyDigest: boolean
  productUpdates: boolean
}
