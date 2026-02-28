import { NextResponse } from "next/server"
import { analyzeSchema } from "@/lib/validations"
import { analyzeWithAI } from "@/lib/services/ai.service"
import { analyzeContent, type AnalyzeOptions } from "@/lib/services/risk.service"
import { analyzeUrl, extractUrls } from "@/lib/services/url.service"
import { createReport } from "@/lib/services/report.service"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = analyzeSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const inputContent = parsed.data.content

    // 1. Check if the input contains URLs that we should fetch
    const urls = extractUrls(inputContent)
    let urlAnalysisSignals: string[] = []
    let urlScore: number | undefined
    let contentScore: number | undefined
    let enrichedContent = inputContent

    if (urls.length > 0) {
      // Analyze the first URL (primary target)
      const urlResult = await analyzeUrl(urls[0])

      urlAnalysisSignals = urlResult.signals
      urlScore = urlResult.urlScore
      contentScore = urlResult.contentScore

      // Enrich the content with the fetched page data for AI analysis
      if (urlResult.pageContent) {
        enrichedContent = `[User submitted URL: ${urls[0]}]
[Final URL after redirects: ${urlResult.finalUrl}]
[Page reachable: ${urlResult.reachable}]
[Page title: ${urlResult.title || "None"}]
[URL structure signals: ${urlResult.signals.join("; ")}]

--- Fetched page content ---
${urlResult.pageContent.slice(0, 1500)}

--- Original user input ---
${inputContent}`
      }
    }

    // 2. Run AI analysis on enriched content
    const aiResult = await analyzeWithAI(enrichedContent)

    // 3. Run deterministic risk engine
    const options: AnalyzeOptions = {
      aiProbability: aiResult.probability,
      aiReasoning: aiResult.reasoning,
      aiCategory: aiResult.suggestedCategory,
      urlSignals: urlAnalysisSignals.length > 0 ? urlAnalysisSignals : undefined,
      urlScore,
      contentScore,
    }

    const riskResult = analyzeContent(inputContent, options)

    // 4. Store report
    const report = await createReport({
      content: inputContent.slice(0, 500),
      score: riskResult.score,
      status: "Active",
      confidence: riskResult.confidence,
      category: riskResult.category,
      redFlags: riskResult.redFlags,
      recommendations: riskResult.recommendations,
      breakdown: riskResult.breakdown,
    })

    const responsePayload = {
      success: true,
      report: {
        id: report.id,
        score: riskResult.score,
        status: report.status,
        confidence: riskResult.confidence,
        category: riskResult.category,
        redFlags: riskResult.redFlags,
        recommendations: riskResult.recommendations,
        breakdown: riskResult.breakdown,
        aiReasoning: riskResult.aiReasoning,
        aiSource: aiResult.source, // "gemini" or "heuristic"
        createdAt: report.createdAt,
      },
    }

    return NextResponse.json(responsePayload)
  } catch (error) {
    console.error("[FraudSense] Analysis API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
