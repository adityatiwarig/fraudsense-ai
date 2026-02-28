"use client"

import { AnimatedCounter } from "@/components/animated/animated-counter"
import { ShieldAlert, TrendingUp, FileText, Clock } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { ReportStats } from "@/lib/types/report"

interface KPICardProps {
  icon: LucideIcon
  label: string
  value: number
  suffix?: string
  trend?: string
  trendUp?: boolean
}

function KPICard({ icon: Icon, label, value, suffix = "", trend, trendUp }: KPICardProps) {
  return (
    <div className="glass-card flex flex-col gap-3 rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan/10 text-cyan">
          <Icon className="h-4 w-4" strokeWidth={1.5} />
        </div>
        {trend && (
          <span
            className={`text-xs font-medium ${
              trendUp ? "text-success" : "text-destructive"
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">
          <AnimatedCounter target={value} suffix={suffix} />
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

export function KPICards({ stats }: { stats: ReportStats }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <KPICard
        icon={ShieldAlert}
        label="Threats Detected"
        value={stats.high}
        trend={stats.total > 0 ? `${Math.round((stats.high / stats.total) * 100)}% critical` : "No data"}
        trendUp={true}
      />
      <KPICard
        icon={TrendingUp}
        label="Risk Score Avg"
        value={stats.avgScore}
        suffix="/100"
        trend={stats.avgScore >= 60 ? "High risk profile" : "Stable profile"}
        trendUp={stats.avgScore < 60}
      />
      <KPICard
        icon={FileText}
        label="Reports Generated"
        value={stats.total}
        trend={`${stats.medium} medium`}
        trendUp={true}
      />
      <KPICard
        icon={Clock}
        label="Low Risk Reports"
        value={stats.low}
        trend={`${stats.total > 0 ? Math.round((stats.low / stats.total) * 100) : 0}% of total`}
        trendUp={true}
      />
    </div>
  )
}
