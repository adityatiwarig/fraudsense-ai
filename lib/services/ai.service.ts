// AI Service Integration
// Uses Gemini for live model inference and falls back to deterministic heuristics only when needed.

import crypto from "crypto"
import { GoogleGenAI } from "@google/genai"

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3-flash-preview"

const ALLOWED_CATEGORIES = [
  "Phishing",
  "Financial Scam",
  "Identity Theft",
  "Malware",
  "Social Engineering",
  "General Suspicious Content",
  "Legitimate",
] as const

const GEMINI_PROMPT = `You are a fraud detection AI specializing in scam analysis.
Analyze the provided content and determine fraud probability.

Return ONLY valid JSON with this exact structure:
{
  "probability": <number 0-100>,
  "reasoning": "<2-3 short sentences>",
  "suggestedCategory": "<one of: Phishing, Financial Scam, Identity Theft, Malware, Social Engineering, General Suspicious Content, Legitimate>"
}

Do not include markdown, code fences, or extra keys.`

export interface AIAnalysisResult {
  probability: number
  reasoning: string
  suggestedCategory: string
  source: "gemini" | "heuristic"
}

// --- In-memory result cache (survives within same server process) ---
const resultCache = new Map<string, { result: AIAnalysisResult; timestamp: number }>()
const CACHE_TTL_MS = 1000 * 60 * 60 // 1 hour

function getCacheKey(content: string): string {
  return crypto.createHash("sha256").update(content.trim().toLowerCase()).digest("hex")
}

function getCachedResult(content: string): AIAnalysisResult | null {
  const key = getCacheKey(content)
  const entry = resultCache.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    resultCache.delete(key)
    return null
  }
  return entry.result
}

function setCachedResult(content: string, result: AIAnalysisResult) {
  const key = getCacheKey(content)
  resultCache.set(key, { result, timestamp: Date.now() })
  // Prevent unbounded growth - evict oldest when above 500 entries
  if (resultCache.size > 500) {
    const firstKey = resultCache.keys().next().value
    if (firstKey) resultCache.delete(firstKey)
  }
}

// --- Main entry point ---
export async function analyzeWithAI(content: string): Promise<AIAnalysisResult> {
  // 1. Check cache first - same input always returns same result
  const cached = getCachedResult(content)
  if (cached) return cached

  // 2. Try Gemini if API key exists
  const apiKey = process.env.GEMINI_API_KEY
  if (apiKey) {
    const geminiResult = await callGeminiWithRetry(content, apiKey, 2)
    if (geminiResult) {
      setCachedResult(content, geminiResult)
      return geminiResult
    }
  }

  // 3. Fallback to deterministic heuristic engine
  const heuristicResult = generateHeuristicResult(content)
  setCachedResult(content, heuristicResult)
  return heuristicResult
}

function normalizeJsonCandidate(rawText: string): string {
  const cleaned = rawText.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "")
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
  return (jsonMatch ? jsonMatch[0] : cleaned).trim()
}

function safeJsonParse(text: string): Record<string, unknown> | null {
  try {
    return JSON.parse(normalizeJsonCandidate(text))
  } catch {
    return null
  }
}

function toValidCategory(category: unknown): string {
  const value = String(category || "").trim()
  if ((ALLOWED_CATEGORIES as readonly string[]).includes(value)) {
    return value
  }
  return "General Suspicious Content"
}

function isRetryableGeminiError(error: unknown): boolean {
  const message = String(error || "")
  return (
    message.includes("429") ||
    message.includes("503") ||
    message.includes("RESOURCE_EXHAUSTED") ||
    message.includes("UNAVAILABLE")
  )
}

function buildGeminiInput(content: string): string {
  return `${GEMINI_PROMPT}

Content to analyze:
${content}`
}

// --- Gemini API call with retry on transient failures ---
async function callGeminiWithRetry(
  content: string,
  apiKey: string,
  maxRetries: number
): Promise<AIAnalysisResult | null> {
  const ai = new GoogleGenAI({ apiKey })

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: buildGeminiInput(content),
        config: {
          temperature: 0,
          maxOutputTokens: 512,
          responseMimeType: "application/json",
        },
      })

      const text = response.text
      if (!text) return null

      const parsed = safeJsonParse(text)
      if (!parsed) return null

      const probabilityValue = Number(parsed.probability)
      const probability = Number.isFinite(probabilityValue) ? probabilityValue : 50
      const reasoning = String(parsed.reasoning || "").trim()

      return {
        probability: Math.min(Math.max(probability, 0), 100),
        reasoning: reasoning || "Analysis completed.",
        suggestedCategory: toValidCategory(parsed.suggestedCategory),
        source: "gemini",
      }
    } catch (error) {
      if (!isRetryableGeminiError(error) || attempt === maxRetries) {
        return null
      }

      const waitMs = Math.min(1000 * Math.pow(2, attempt), 8000)
      await new Promise((resolve) => setTimeout(resolve, waitMs))
    }
  }

  return null
}

// --- Deterministic Heuristic Engine ---
// This produces the exact same result for the exact same input, every time.

const HEURISTIC_CATEGORIES: {
  name: string
  terms: string[]
  weight: number
}[] = [
  {
    name: "Phishing",
    terms: [
      "verify your account", "confirm your identity", "click here",
      "update your payment", "unusual activity", "login credentials",
      "password expired", "security alert", "suspended",
      "sign in to restore", "click the link below",
    ],
    weight: 7,
  },
  {
    name: "Financial Scam",
    terms: [
      "guaranteed profit", "investment opportunity", "double your money",
      "wire transfer", "upfront payment", "no risk", "guaranteed return",
      "act fast", "forex", "trading signal",
    ],
    weight: 7,
  },
  {
    name: "Identity Theft",
    terms: [
      "social security", "ssn", "tax refund", "irs",
      "personal information", "bank account number", "credit card number",
      "date of birth", "mother's maiden name", "passport number",
    ],
    weight: 8,
  },
  {
    name: "Malware",
    terms: [
      "download now", "free software", "click to install",
      "your computer is infected", "run this file", "enable macros",
      "attachment", "execute", "trojan", "virus detected",
    ],
    weight: 7,
  },
  {
    name: "Social Engineering",
    terms: [
      "i need your help", "please don't tell anyone", "this is confidential",
      "boss asked me", "ceo", "wire the funds", "gift card",
      "keep this between us", "do me a favor",
    ],
    weight: 7,
  },
  {
    name: "Crypto Scam",
    terms: [
      "bitcoin", "crypto", "btc", "ethereum", "eth", "nft",
      "airdrop", "wallet connect", "seed phrase", "private key",
    ],
    weight: 6,
  },
]

const URGENCY_TERMS = [
  "act immediately", "act now", "urgent", "expire", "last chance",
  "within 24 hours", "limited time", "don't miss", "right away", "asap",
  "only today", "hours left",
]

const TRUST_EXPLOIT_TERMS = [
  "dear customer", "dear user", "dear valued",
  "we regret to inform", "your account has been",
  "from the desk of", "official notice",
]

function generateHeuristicResult(content: string): AIAnalysisResult {
  const lower = content.toLowerCase()
  const reasons: string[] = []

  // --- Score each category deterministically ---
  let bestCategory = "General Suspicious Content"
  let bestCategoryHits = 0
  let totalTermHits = 0

  for (const category of HEURISTIC_CATEGORIES) {
    let hits = 0
    for (const term of category.terms) {
      if (lower.includes(term)) {
        hits++
      }
    }
    totalTermHits += hits * category.weight
    if (hits > bestCategoryHits) {
      bestCategoryHits = hits
      bestCategory = category.name
    }
  }

  // Base probability from term hits (deterministic)
  let probability = Math.min(10 + totalTermHits, 80)

  // Urgency language
  let urgencyHits = 0
  for (const term of URGENCY_TERMS) {
    if (lower.includes(term)) urgencyHits++
  }
  if (urgencyHits > 0) {
    probability += urgencyHits * 5
    reasons.push(`Uses ${urgencyHits} urgency phrase(s)`)
  }

  // Trust exploitation
  let trustHits = 0
  for (const term of TRUST_EXPLOIT_TERMS) {
    if (lower.includes(term)) trustHits++
  }
  if (trustHits > 0) {
    probability += trustHits * 4
    reasons.push("Uses trust-exploiting language")
  }

  // ALL CAPS abuse
  const capsWords = content.match(/\b[A-Z]{4,}\b/g)
  if (capsWords && capsWords.length >= 2) {
    probability += 5
    reasons.push("Excessive use of CAPS")
  }

  // Excessive punctuation (!!! or ???)
  const excessPunc = content.match(/[!?]{2,}/g)
  if (excessPunc) {
    probability += 4
    reasons.push("Excessive punctuation")
  }

  // URL presence
  const urls = lower.match(/https?:\/\/[^\s]+/g)
  if (urls && urls.length > 0) {
    probability += 5
    reasons.push(`Contains ${urls.length} URL(s)`)
  }

  // Money mentions
  if (/\$[\d,]+|\d+\s*(dollars|usd|btc|eth)/i.test(lower)) {
    probability += 5
    reasons.push("References monetary amounts")
  }

  // Very short suspicious content
  if (content.length < 50 && totalTermHits > 0) {
    probability += 5
  }

  // If literally nothing suspicious is found, keep it low
  if (totalTermHits === 0 && urgencyHits === 0 && trustHits === 0) {
    probability = Math.min(probability, 15)
    bestCategory = "Legitimate"
    reasons.push("No significant fraud indicators detected")
  } else if (bestCategoryHits > 0) {
    reasons.unshift(`Detected ${bestCategoryHits} ${bestCategory.toLowerCase()} indicator(s)`)
  }

  probability = Math.min(Math.max(probability, 5), 95)

  return {
    probability,
    reasoning: reasons.length > 0
      ? `Heuristic analysis: ${reasons.join(". ")}.`
      : "No significant indicators found in content.",
    suggestedCategory: bestCategory,
    source: "heuristic",
  }
}
