"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-cyan">Risk: {payload[0].value}</p>
      </div>
    )
  }
  return null
}

export function RiskTrendChart({ data }: { data: Array<{ date: string; score: number }> }) {
  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="mb-1 text-sm font-semibold text-foreground">Risk Trend</h3>
      <p className="mb-5 text-xs text-muted-foreground">Average risk score from recent analyses</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(6,214,242,0.06)" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#64748b", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(6,214,242,0.1)" }}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(6,214,242,0.1)" }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#06d6f2"
              strokeWidth={2}
              dot={{ fill: "#06d6f2", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#06d6f2", strokeWidth: 2, stroke: "#060b18" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
