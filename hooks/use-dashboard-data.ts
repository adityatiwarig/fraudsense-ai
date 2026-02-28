"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { NotificationPrefs, ReportItem, ReportStats } from "@/lib/types/report"

const REPORTS_CACHE_KEY = "fraudai_reports_cache"
const NOTIFICATION_PREFS_KEY = "fraudai_notification_prefs"
const REPORTS_UPDATED_EVENT = "fraudai:reports-updated"

const DEFAULT_PREFS: NotificationPrefs = {
  highRiskAlerts: true,
  weeklyDigest: true,
  productUpdates: false,
}

function normalizeReportItem(report: ReportItem | (Omit<ReportItem, "status"> & { status?: "Active" | "Resolved" })): ReportItem {
  return {
    ...report,
    status: report.status || "Active",
  }
}

function readLocalReports(): ReportItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(REPORTS_CACHE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as ReportItem[]
    return Array.isArray(parsed) ? parsed.map((item) => normalizeReportItem(item)) : []
  } catch {
    return []
  }
}

function writeLocalReports(reports: ReportItem[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(REPORTS_CACHE_KEY, JSON.stringify(reports.slice(0, 100)))
}

function readPrefs(): NotificationPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS
  try {
    const raw = localStorage.getItem(NOTIFICATION_PREFS_KEY)
    if (!raw) return DEFAULT_PREFS
    const parsed = JSON.parse(raw) as Partial<NotificationPrefs>
    return {
      highRiskAlerts: parsed.highRiskAlerts ?? DEFAULT_PREFS.highRiskAlerts,
      weeklyDigest: parsed.weeklyDigest ?? DEFAULT_PREFS.weeklyDigest,
      productUpdates: parsed.productUpdates ?? DEFAULT_PREFS.productUpdates,
    }
  } catch {
    return DEFAULT_PREFS
  }
}

function writePrefs(prefs: NotificationPrefs) {
  if (typeof window === "undefined") return
  localStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(prefs))
}

function mergeReports(incoming: ReportItem[], cached: ReportItem[]): ReportItem[] {
  const map = new Map<string, ReportItem>()
  for (const item of [...incoming, ...cached]) {
    map.set(item.id, normalizeReportItem(item))
  }
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function addReportToClientCache(report: ReportItem) {
  const merged = mergeReports([report], readLocalReports())
  writeLocalReports(merged)
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(REPORTS_UPDATED_EVENT))
  }
}

export function useDashboardData() {
  const [reports, setReports] = useState<ReportItem[]>([])
  const [apiStats, setApiStats] = useState<ReportStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_PREFS)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/reports", { cache: "no-store" })
      if (!res.ok) throw new Error("Failed to fetch reports")
      const json = await res.json()
      const apiReports = (json?.reports || []) as ReportItem[]
      const merged = mergeReports(apiReports, readLocalReports())
      setReports(merged)
      writeLocalReports(merged)
      if (json?.stats) {
        setApiStats(json.stats as ReportStats)
      }
    } catch {
      setReports(readLocalReports())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setPrefs(readPrefs())
    void refresh()
    const interval = setInterval(() => void refresh(), 5000)
    const onReportsUpdate = () => setReports(readLocalReports())
    const onStorage = (event: StorageEvent) => {
      if (event.key === REPORTS_CACHE_KEY) {
        setReports(readLocalReports())
      }
    }

    window.addEventListener(REPORTS_UPDATED_EVENT, onReportsUpdate)
    window.addEventListener("storage", onStorage)

    return () => {
      clearInterval(interval)
      window.removeEventListener(REPORTS_UPDATED_EVENT, onReportsUpdate)
      window.removeEventListener("storage", onStorage)
    }
  }, [refresh])

  const stats: ReportStats = useMemo(() => {
    const localTotal = reports.length
    const localHigh = reports.filter((r) => r.score >= 70).length
    const localMedium = reports.filter((r) => r.score >= 40 && r.score < 70).length
    const localLow = reports.filter((r) => r.score < 40).length
    const localAvgScore = localTotal > 0
      ? Math.round(reports.reduce((sum, r) => sum + r.score, 0) / localTotal)
      : 0

    if (!apiStats) {
      return { total: localTotal, high: localHigh, medium: localMedium, low: localLow, avgScore: localAvgScore }
    }

    // Use max totals to keep dashboard reactive while API and cache synchronize.
    return {
      total: Math.max(apiStats.total, localTotal),
      high: Math.max(apiStats.high, localHigh),
      medium: Math.max(apiStats.medium, localMedium),
      low: Math.max(apiStats.low, localLow),
      avgScore: localTotal > 0 ? localAvgScore : apiStats.avgScore,
    }
  }, [reports, apiStats])

  const trendData = useMemo(() => {
    const last30 = reports.slice(0, 30)
    if (last30.length === 0) {
      return [
        { date: "No data", score: 0 },
      ]
    }
    const byDay = new Map<string, { total: number; count: number }>()
    for (const report of last30) {
      const day = new Date(report.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })
      const curr = byDay.get(day) || { total: 0, count: 0 }
      byDay.set(day, { total: curr.total + report.score, count: curr.count + 1 })
    }
    return Array.from(byDay.entries())
      .map(([date, agg]) => ({ date, score: Math.round(agg.total / agg.count) }))
      .slice(-10)
  }, [reports])

  const categoryData = useMemo(() => {
    const relevant = reports.slice(0, 50)
    const total = relevant.length || 1
    const counts = new Map<string, number>()
    for (const report of relevant) {
      counts.set(report.category, (counts.get(report.category) || 0) + 1)
    }
    return Array.from(counts.entries())
      .map(([name, count], idx) => ({
        name,
        value: Math.round((count / total) * 100),
        color: ["#06d6f2", "#3b82f6", "#7c3aed", "#f59e0b", "#64748b"][idx % 5],
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }, [reports])

  const notifications = useMemo(() => {
    return reports
      .filter((r) => r.score >= 70 && r.status === "Active")
      .slice(0, 5)
      .map((r) => ({
        id: r.id,
        title: `${r.category} detected`,
        message: r.content,
        createdAt: r.createdAt,
      }))
  }, [reports])

  const updatePrefs = (next: NotificationPrefs) => {
    setPrefs(next)
    writePrefs(next)
  }

  const updateReportStatus = async (id: string, status: "Active" | "Resolved") => {
    const updatedLocal = reports.map((report) =>
      report.id === id ? { ...report, status } : report
    )
    setReports(updatedLocal)
    writeLocalReports(updatedLocal)

    try {
      const response = await fetch(`/api/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!response.ok) {
        throw new Error(`Status update failed: ${response.status}`)
      }
      const json = await response.json()
      if (json?.report) {
        const merged = mergeReports([json.report as ReportItem], readLocalReports())
        setReports(merged)
        writeLocalReports(merged)
      }
      await refresh()
    } catch {
      await refresh()
    }
  }

  return {
    loading,
    reports,
    stats,
    trendData,
    categoryData,
    notifications,
    prefs,
    updatePrefs,
    updateReportStatus,
    refresh,
  }
}
