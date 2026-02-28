"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { Button } from "@/components/ui/button"

function getSeverityBadge(score: number) {
  if (score >= 80) return <Badge className="border-destructive/30 bg-destructive/10 text-destructive text-[10px]">Critical</Badge>
  if (score >= 60) return <Badge className="border-warning/30 bg-warning/10 text-warning text-[10px]">High</Badge>
  return <Badge className="border-success/30 bg-success/10 text-success text-[10px]">Low</Badge>
}

export default function ReportsPage() {
  const { reports, loading, updateReportStatus } = useDashboardData()
  const [filter, setFilter] = useState<"All" | "Active" | "Resolved">("All")

  const visibleReports = useMemo(() => {
    if (filter === "All") return reports
    return reports.filter((report) => report.status === filter)
  }, [reports, filter])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan/10 text-cyan">
          <FileText className="h-4 w-4" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">All Reports</h2>
          <p className="text-xs text-muted-foreground">Complete history of fraud analysis reports</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["All", "Active", "Resolved"] as const).map((option) => (
          <Button
            key={option}
            type="button"
            size="sm"
            variant={filter === option ? "default" : "outline"}
            className={filter === option ? "bg-cyan text-primary-foreground hover:bg-cyan/90" : "border-cyan/20"}
            onClick={() => setFilter(option)}
          >
            {option}
          </Button>
        ))}
      </div>

      <div className="glass-card overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">ID</th>
                <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Content</th>
                <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Category</th>
                <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Score</th>
                <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Severity</th>
                <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleReports.map((report) => (
                <tr key={report.id} className="border-b border-border/50 transition-colors hover:bg-secondary/30">
                  <td className="px-5 py-3 font-mono text-xs text-cyan">{report.id}</td>
                  <td className="max-w-xs truncate px-5 py-3 text-xs text-foreground">{report.content}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{report.category}</td>
                  <td className="px-5 py-3 text-xs font-medium text-foreground">{report.score}</td>
                  <td className="px-5 py-3">{getSeverityBadge(report.score)}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${report.status === "Active" ? "border-cyan/30 text-cyan" : "border-success/30 text-success"}`}
                    >
                      {report.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 border-cyan/20 px-2 text-[10px]"
                      onClick={() =>
                        updateReportStatus(
                          report.id,
                          report.status === "Active" ? "Resolved" : "Active"
                        )
                      }
                    >
                      {report.status === "Active" ? "Resolve" : "Reopen"}
                    </Button>
                  </td>
                </tr>
              ))}
              {visibleReports.length === 0 && !loading && (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-xs text-muted-foreground">
                    No reports yet. Analyze content to generate live reports.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
