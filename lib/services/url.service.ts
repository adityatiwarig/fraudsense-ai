// URL Content Fetching Service
// Actually fetches and parses content from URLs for real analysis

const URL_REGEX = /https?:\/\/[^\s"'<>]+/gi

/**
 * Extracts all URLs from the given text
 */
export function extractUrls(text: string): string[] {
  const matches = text.match(URL_REGEX)
  return matches ? [...new Set(matches)] : []
}

/**
 * Fetches a URL and extracts useful text content from the HTML
 */
async function fetchUrlContent(url: string): Promise<{
  finalUrl: string
  title: string
  text: string
  statusCode: number
  redirected: boolean
  headers: Record<string, string>
}> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; FraudSenseBot/1.0; +https://fraudsense.ai)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
    })

    clearTimeout(timeout)

    const html = await response.text()

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim().replace(/\s+/g, " ") : ""

    // Extract meta description
    const metaDescMatch = html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["']/i
    )
    const metaDesc = metaDescMatch ? metaDescMatch[1].trim() : ""

    // Strip HTML tags and get text content
    let text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim()

    // Limit to first 3000 chars of text
    text = text.slice(0, 3000)

    const relevantHeaders: Record<string, string> = {}
    for (const key of ["content-type", "server", "x-powered-by", "x-frame-options"]) {
      const val = response.headers.get(key)
      if (val) relevantHeaders[key] = val
    }

    return {
      finalUrl: response.url,
      title,
      text: metaDesc ? `${title}. ${metaDesc}. ${text}` : `${title}. ${text}`,
      statusCode: response.status,
      redirected: response.redirected,
      headers: relevantHeaders,
    }
  } catch (error) {
    clearTimeout(timeout)
    const errMsg = error instanceof Error ? error.message : "Unknown error"
    return {
      finalUrl: url,
      title: "",
      text: "",
      statusCode: 0,
      redirected: false,
      headers: {},
    }
  }
}

/**
 * URL-specific risk signals based on domain and structure analysis
 */
function analyzeUrlStructure(url: string, finalUrl: string): {
  signals: string[]
  score: number
} {
  const signals: string[] = []
  let score = 0

  try {
    const parsed = new URL(url)
    const hostname = parsed.hostname.toLowerCase()

    // Check for IP address instead of domain
    if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
      signals.push("URL uses raw IP address instead of domain name")
      score += 25
    }

    // Check for suspicious TLDs
    const suspiciousTlds = [".xyz", ".top", ".buzz", ".club", ".icu", ".work", ".tk", ".ml", ".ga", ".cf"]
    if (suspiciousTlds.some((tld) => hostname.endsWith(tld))) {
      signals.push(`Suspicious top-level domain: ${hostname.split(".").pop()}`)
      score += 15
    }

    // Check for extremely long hostnames (potential obfuscation)
    if (hostname.length > 50) {
      signals.push("Abnormally long hostname (possible obfuscation)")
      score += 10
    }

    // Check for many subdomains
    const parts = hostname.split(".")
    if (parts.length > 4) {
      signals.push(`Excessive subdomains detected (${parts.length - 2} levels)`)
      score += 10
    }

    // Check for typosquatting patterns (common brand names with slight misspellings)
    const brandPatterns = [
      { brand: "google", pattern: /go+gle|googl[^e]|g00gle/i },
      { brand: "paypal", pattern: /paypa[^l]|paypai|payp[^a]/i },
      { brand: "apple", pattern: /app[^l]e|appl[^e]|4pple/i },
      { brand: "amazon", pattern: /amaz[^o]n|amazo[^n]|amzon/i },
      { brand: "microsoft", pattern: /micros[^o]ft|microso[^f]t/i },
      { brand: "facebook", pattern: /faceb[^o]ok|facebo[^o]k/i },
      { brand: "netflix", pattern: /netfl[^i]x|netfli[^x]/i },
    ]
    for (const { brand, pattern } of brandPatterns) {
      if (pattern.test(hostname) && !hostname.includes(brand)) {
        signals.push(`Potential typosquatting of "${brand}"`)
        score += 20
      }
    }

    // Check for HTTP (not HTTPS)
    if (parsed.protocol === "http:") {
      signals.push("Insecure connection (HTTP, no SSL/TLS)")
      score += 10
    }

    // Check for redirect mismatch
    if (finalUrl && finalUrl !== url) {
      const finalParsed = new URL(finalUrl)
      if (finalParsed.hostname !== parsed.hostname) {
        signals.push(`Redirects to different domain: ${finalParsed.hostname}`)
        score += 15
      }
    }

    // Check for port numbers
    if (parsed.port && !["80", "443", ""].includes(parsed.port)) {
      signals.push(`Non-standard port: ${parsed.port}`)
      score += 10
    }

    // Check for suspicious paths
    const path = parsed.pathname.toLowerCase()
    if (path.includes("login") || path.includes("signin") || path.includes("account") || path.includes("verify")) {
      signals.push("URL path contains authentication-related keywords")
      score += 5
    }

    // Check for Base64 in URL
    if (/[A-Za-z0-9+/=]{50,}/.test(parsed.search)) {
      signals.push("URL contains long encoded parameters (possible data exfiltration)")
      score += 15
    }

  } catch {
    signals.push("Malformed URL structure")
    score += 20
  }

  return { signals, score: Math.min(score, 100) }
}

/**
 * Content-based signals from the fetched page
 */
function analyzePageContent(
  content: string,
  title: string,
  statusCode: number
): { signals: string[]; score: number } {
  const signals: string[] = []
  let score = 0
  const lower = content.toLowerCase()

  // Page not reachable
  if (statusCode === 0) {
    signals.push("Page could not be reached (may be taken down or blocking bots)")
    score += 10
  }

  // Check for login/credential forms
  if (lower.includes("password") && (lower.includes("login") || lower.includes("sign in"))) {
    signals.push("Page contains login/credential form")
    score += 10
  }

  // Check for urgency language on the page
  const urgencyTerms = ["act now", "immediately", "urgent", "expires", "limited time", "your account will be", "suspended"]
  const foundUrgency = urgencyTerms.filter((t) => lower.includes(t))
  if (foundUrgency.length > 0) {
    signals.push(`Page uses urgency language: "${foundUrgency.join('", "')}"`)
    score += foundUrgency.length * 5
  }

  // Check for financial keywords
  const financialTerms = ["credit card", "bank account", "social security", "ssn", "wire transfer", "bitcoin", "crypto wallet"]
  const foundFinancial = financialTerms.filter((t) => lower.includes(t))
  if (foundFinancial.length > 0) {
    signals.push(`Page requests sensitive financial info: "${foundFinancial.join('", "')}"`)
    score += foundFinancial.length * 8
  }

  // Check for personal info requests
  const personalTerms = ["date of birth", "mother's maiden", "passport", "driver's license"]
  const foundPersonal = personalTerms.filter((t) => lower.includes(t))
  if (foundPersonal.length > 0) {
    signals.push(`Page requests personal identity information`)
    score += foundPersonal.length * 8
  }

  // Very little content could indicate a phishing stub
  if (content.length < 100 && statusCode === 200) {
    signals.push("Page has very little content (possible phishing stub)")
    score += 10
  }

  return { signals, score: Math.min(score, 100) }
}

export interface UrlAnalysisResult {
  url: string
  finalUrl: string
  reachable: boolean
  title: string
  pageContent: string
  signals: string[]
  urlScore: number
  contentScore: number
}

/**
 * Full URL analysis: fetches the page, analyzes structure and content
 */
export async function analyzeUrl(url: string): Promise<UrlAnalysisResult> {
  const fetched = await fetchUrlContent(url)
  const urlStructure = analyzeUrlStructure(url, fetched.finalUrl)
  const pageAnalysis = analyzePageContent(fetched.text, fetched.title, fetched.statusCode)

  return {
    url,
    finalUrl: fetched.finalUrl,
    reachable: fetched.statusCode > 0,
    title: fetched.title,
    pageContent: fetched.text.slice(0, 2000),
    signals: [...urlStructure.signals, ...pageAnalysis.signals],
    urlScore: urlStructure.score,
    contentScore: pageAnalysis.score,
  }
}
