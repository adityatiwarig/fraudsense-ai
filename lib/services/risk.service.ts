// Risk Scoring Engine
// Deterministic: same input always produces the same output
//
// Scoring Formula:
//   When URL analysis is available:
//     Final Score = (AI probability * 0.40) + (Keyword score * 0.15) + (Frequency score * 0.10) + (URL score * 0.35)
//   Text only:
//     Final Score = (AI probability * 0.60) + (Keyword score * 0.20) + (Frequency score * 0.20)

const FRAUD_KEYWORDS: Record<string, string[]> = {
  phishing: [
    "verify your account", "click here immediately", "suspended",
    "confirm your identity", "update your payment", "unusual activity",
    "login credentials", "password expired", "security alert",
    "act now", "limited time", "sign in to restore",
  ],
  financial_scam: [
    "guaranteed profit", "investment opportunity", "double your money",
    "crypto", "bitcoin", "wire transfer", "upfront payment",
    "no risk", "guaranteed return", "act fast", "forex",
  ],
  identity_theft: [
    "social security", "ssn", "tax refund", "irs",
    "personal information", "bank account", "credit card number",
    "date of birth", "mother's maiden name", "passport number",
  ],
  malware: [
    "download now", "free software", "click to install",
    "your computer is infected", "run this file", "enable macros",
    "attachment", "execute", "trojan",
  ],
  social_engineering: [
    "gift card", "wire the funds", "ceo", "boss asked me",
    "keep this between us", "do me a favor", "confidential",
  ],
}

const URGENCY_PATTERNS = [
  "act immediately", "act now", "urgent", "expire",
  "within 24 hours", "limited time", "don't miss",
  "last chance", "right away", "asap", "only today",
]

export interface RiskResult {
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
}

function calculateKeywordScore(content: string): {
  score: number
  category: string
  flags: string[]
} {
  const lower = content.toLowerCase()
  let maxScore = 0
  let detectedCategory = "General Suspicious Content"
  const flags: string[] = []

  for (const [category, keywords] of Object.entries(FRAUD_KEYWORDS)) {
    let categoryHits = 0
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        categoryHits++
        flags.push(`Keyword detected: "${keyword}"`)
      }
    }
    const categoryScore = Math.min((categoryHits / keywords.length) * 100, 100)
    if (categoryScore > maxScore) {
      maxScore = categoryScore
      detectedCategory = category
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    }
  }

  // Check urgency patterns
  let urgencyHits = 0
  for (const pattern of URGENCY_PATTERNS) {
    if (lower.includes(pattern)) {
      urgencyHits++
      flags.push(`Urgency language: "${pattern}"`)
    }
  }
  if (urgencyHits > 0) {
    maxScore = Math.min(maxScore + urgencyHits * 8, 100)
    flags.push("High-pressure urgency tactics detected")
  }

  // Check for suspicious URL patterns in text
  const urlPatterns = /https?:\/\/[^\s]+/gi
  const urls = lower.match(urlPatterns)
  if (urls) {
    flags.push(`${urls.length} link(s) found in content`)
    maxScore = Math.min(maxScore + 10, 100)
  }

  return { score: maxScore, category: detectedCategory, flags }
}

function calculateFrequencyScore(content: string): number {
  const lower = content.toLowerCase()
  let score = 0

  // Very short content
  if (content.length < 50) score += 10
  // Very long content
  if (content.length > 2000) score += 5

  // ALL CAPS usage
  const capsWords = content.match(/\b[A-Z]{3,}\b/g)
  if (capsWords && capsWords.length > 2) {
    score += 15
  }

  // Excessive punctuation
  const excessivePunctuation = content.match(/[!?]{2,}/g)
  if (excessivePunctuation) {
    score += 10
  }

  // Money mentions
  const moneyPattern = /\$[\d,]+|\d+\s*(dollars|usd|btc|eth)/gi
  if (moneyPattern.test(lower)) {
    score += 15
  }

  // Email patterns (from: headers)
  if (/@.*\.(xyz|top|buzz|tk|ml|ga|cf)\b/i.test(lower)) {
    score += 15
  }

  return Math.min(score, 100)
}

export interface AnalyzeOptions {
  aiProbability: number
  aiReasoning: string
  aiCategory: string
  urlSignals?: string[]
  urlScore?: number
  contentScore?: number
}

export function analyzeContent(content: string, options: AnalyzeOptions): RiskResult {
  const keywordResult = calculateKeywordScore(content)
  const frequencyScore = calculateFrequencyScore(content)

  // Merge URL signals into red flags
  const allFlags = [...keywordResult.flags]
  if (options.urlSignals) {
    allFlags.push(...options.urlSignals)
  }

  // Use AI's suggested category if it has more confidence, otherwise use keyword detection
  const category =
    options.aiCategory !== "General Suspicious Content" && options.aiCategory !== "Legitimate"
      ? options.aiCategory
      : keywordResult.category

  // Combined URL score (structure + page content analysis)
  const combinedUrlScore =
    options.urlScore != null && options.contentScore != null
      ? Math.min(options.urlScore + options.contentScore, 100)
      : null

  let finalScore: number
  if (combinedUrlScore != null) {
    // URL-inclusive formula
    finalScore = Math.round(
      options.aiProbability * 0.4 +
      keywordResult.score * 0.15 +
      frequencyScore * 0.1 +
      combinedUrlScore * 0.35
    )
  } else {
    // Text-only formula
    finalScore = Math.round(
      options.aiProbability * 0.6 +
      keywordResult.score * 0.2 +
      frequencyScore * 0.2
    )
  }

  const clampedScore = Math.min(Math.max(finalScore, 0), 100)

  let confidence: "Low" | "Medium" | "High"
  if (clampedScore >= 70) confidence = "High"
  else if (clampedScore >= 40) confidence = "Medium"
  else confidence = "Low"

  const recommendations: string[] = []
  if (clampedScore >= 70) {
    recommendations.push("Do not interact with this content.")
    recommendations.push("Report to your IT security team immediately.")
    recommendations.push("Block the sender and mark as spam.")
    if (combinedUrlScore != null) {
      recommendations.push("Do not visit or click any links in this content.")
    }
  } else if (clampedScore >= 40) {
    recommendations.push("Exercise caution with this content.")
    recommendations.push("Verify the sender through official channels.")
    recommendations.push("Do not click any links until verified.")
  } else {
    recommendations.push("Content appears relatively safe.")
    recommendations.push("Remain vigilant for any unusual requests.")
  }

  return {
    score: clampedScore,
    confidence,
    category,
    redFlags: allFlags,
    recommendations,
    breakdown: {
      aiProbability: options.aiProbability,
      keywordScore: Math.round(keywordResult.score),
      frequencyScore: Math.round(frequencyScore),
      urlScore: combinedUrlScore,
    },
    aiReasoning: options.aiReasoning,
  }
}
