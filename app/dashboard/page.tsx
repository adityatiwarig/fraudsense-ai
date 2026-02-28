"use client"

import { KPICards } from "@/components/analytics/kpi-cards"
import { RiskTrendChart } from "@/components/analytics/risk-trend-chart"
import { CategoryPieChart } from "@/components/analytics/category-pie-chart"
import { RiskGauge } from "@/components/analytics/risk-gauge"
import { RecentReportsTable } from "@/components/analytics/recent-reports-table"
import { useDashboardData } from "@/hooks/use-dashboard-data"

export default function DashboardPage() {
  const { loading, stats, reports, trendData, categoryData, notifications } = useDashboardData()

  return (
    <div className="flex flex-col gap-6">
      <KPICards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RiskTrendChart data={trendData} />
        </div>
        <div className="flex flex-col gap-6">
          <RiskGauge score={stats.avgScore} />
          <CategoryPieChart data={categoryData} />
        </div>
      </div>

      {loading && reports.length === 0 ? (
        <div className="glass-card rounded-xl p-6 text-sm text-muted-foreground">
          Loading live dashboard data...
        </div>
      ) : (
        <RecentReportsTable reports={reports} />
      )}

      <div className="glass-card rounded-xl p-5">
        <h3 className="mb-1 text-sm font-semibold text-foreground">Notifications</h3>
        <p className="mb-4 text-xs text-muted-foreground">Latest high-risk detections</p>
        <div className="flex flex-col gap-3">
          {notifications.map((item) => (
            <div key={item.id} className="rounded-lg border border-border bg-secondary/20 p-3">
              <p className="text-xs font-medium text-foreground">{item.title}</p>
              <p className="truncate text-xs text-muted-foreground">{item.message}</p>
            </div>
          ))}
          {notifications.length === 0 && (
            <p className="text-xs text-muted-foreground">No high-risk notifications yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
