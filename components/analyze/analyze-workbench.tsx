"use client"

import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Scan, ArrowRight, RotateCcw, Globe, FileText, AlertCircle, LayoutDashboard, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnalyzingModal } from "@/components/forms/analyzing-modal"
import { RiskResultCard } from "@/components/analytics/risk-result-card"
import { addReportToClientCache } from "@/hooks/use-dashboard-data"
import { useAuthSession } from "@/hooks/use-auth-session"

const analyzeSchema = z.object({
  content: z
    .string()
    .min(10, "Please enter at least 10 characters for analysis")
    .max(5000, "Content exceeds maximum length"),
})

type AnalyzeForm = z.infer<typeof analyzeSchema>

interface AnalysisResult {
  id: string
  score: number
  status: "Active" | "Resolved"
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
  aiSource: "gemini" | "heuristic"
  createdAt: string
}

export function AnalyzeWorkbench({ compact = false }: { compact?: boolean }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { isLoggedIn } = useAuthSession()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<AnalyzeForm>({
    resolver: zodResolver(analyzeSchema),
  })

  const contentValue = watch("content") || ""
  const hasUrl = /https?:\/\/[^\s]+/i.test(contentValue)

  const onSubmit = async (data: AnalyzeForm) => {
    setIsAnalyzing(true)
    setResult(null)
    setError(null)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: data.content }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || `Server error: ${response.status}`)
      }

      const json = await response.json()
      if (!json.success || !json.report) {
        throw new Error("Invalid response from analysis engine")
      }

      setResult(json.report)
      addReportToClientCache({
        id: json.report.id,
        content: data.content.slice(0, 500),
        score: json.report.score,
        status: "Active",
        confidence: json.report.confidence,
        category: json.report.category,
        redFlags: json.report.redFlags,
        recommendations: json.report.recommendations,
        breakdown: json.report.breakdown,
        createdAt: json.report.createdAt,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError(null)
    reset()
  }

  return (
    <div className={compact ? "mx-auto w-full max-w-3xl" : "mx-auto w-full max-w-3xl px-4 sm:px-6"}>
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
          <Scan className="h-6 w-6" strokeWidth={1.5} />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">Threat Analyzer</h1>
        <p className="text-sm text-muted-foreground">
          Paste suspicious content below and our AI will evaluate the risk level.
          URLs are fetched and analyzed in real-time.
        </p>
      </div>

      {!compact && (
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
          <Link href={isLoggedIn ? "/dashboard" : "/login"}>
            <Button variant="outline" size="sm" className="border-cyan/20 hover:bg-cyan/10">
              <LayoutDashboard className="mr-2 h-3.5 w-3.5" />
              {isLoggedIn ? "Overview" : "Sign in for Dashboard"}
            </Button>
          </Link>
          {isLoggedIn && (
            <Link href="/dashboard/settings">
              <Button variant="outline" size="sm" className="border-cyan/20 hover:bg-cyan/10">
                <Settings className="mr-2 h-3.5 w-3.5" />
                Settings
              </Button>
            </Link>
          )}
        </div>
      )}

      {!result && (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label htmlFor="content" className="text-xs font-medium text-muted-foreground">
                Suspicious Content
              </label>
              {hasUrl && (
                <span className="flex items-center gap-1 text-[10px] font-medium text-cyan">
                  <Globe className="h-3 w-3" />
                  URL detected - will be fetched and analyzed
                </span>
              )}
              {!hasUrl && contentValue.length > 0 && (
                <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                  <FileText className="h-3 w-3" />
                  Text-only analysis
                </span>
              )}
            </div>
            <textarea
              id="content"
              rows={8}
              {...register("content")}
              placeholder={"Paste a suspicious URL, email, SMS, or any text content...\n\nExamples:\n  https://suspicious-site.xyz/login\n  \"Your account has been suspended. Click here to verify...\"\n  \"Congratulations! You've won $10,000. Send your SSN to claim...\""}
              className="w-full resize-none rounded-xl border border-border bg-secondary px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 transition-all focus:border-cyan/40 focus:outline-none focus:ring-2 focus:ring-cyan/20"
            />
            {errors.content && (
              <p className="text-xs text-destructive">{errors.content.message}</p>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isAnalyzing}
            className="h-12 bg-cyan text-primary-foreground hover:bg-cyan/90"
          >
            {hasUrl ? "Fetch & Analyze" : "Analyze Content"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      )}

      {result && (
        <div className="flex flex-col gap-6">
          <RiskResultCard result={result} />
          <Button
            onClick={handleReset}
            variant="outline"
            className="mx-auto border-cyan/20 text-foreground hover:border-cyan/40 hover:bg-cyan/5"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Analyze Another
          </Button>
        </div>
      )}

      <AnalyzingModal isOpen={isAnalyzing} />
    </div>
  )
}
