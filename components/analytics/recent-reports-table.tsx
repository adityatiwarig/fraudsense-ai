"use client"

import { Badge } from "@/components/ui/badge"
import type { ReportItem } from "@/lib/types/report"

function getSeverityBadge(score: number) {
  if (score >= 80) {
    return (
      <Badge className="border-destructive/30 bg-destructive/10 text-destructive text-[10px]">
        Critical
      </Badge>
    )
  }
  if (score >= 60) {
    return (
      <Badge className="border-warning/30 bg-warning/10 text-warning text-[10px]">
        High
      </Badge>
    )
  }
  return (
    <Badge className="border-success/30 bg-success/10 text-success text-[10px]">
      Low
    </Badge>
  )
}

function relativeTime(value: string): string {
  const diffMs = Date.now() - new Date(value).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hr ago`
  const days = Math.floor(hours / 24)
  return `${days} day ago`
}

export function RecentReportsTable({ reports }: { reports: ReportItem[] }) {
  return (
    <div className="glass-card overflow-hidden rounded-xl">
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold text-foreground">Recent Reports</h3>
        <p className="text-xs text-muted-foreground">Latest fraud analysis results</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                ID
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Content
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Category
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Score
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Severity
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {reports.slice(0, 8).map((report) => (
              <tr
                key={report.id}
                className="border-b border-border/50 transition-colors hover:bg-secondary/30"
              >
                <td className="px-5 py-3 font-mono text-xs text-cyan">{report.id}</td>
                <td className="max-w-xs truncate px-5 py-3 text-xs text-foreground">
                  {report.content}
                </td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{report.category}</td>
                <td className="px-5 py-3 text-xs font-medium text-foreground">{report.score}</td>
                <td className="px-5 py-3">{getSeverityBadge(report.score)}</td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{relativeTime(report.createdAt)}</td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-xs text-muted-foreground">
                  No reports yet. Run an analysis to populate live data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
