"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
        <p className="text-sm font-semibold text-foreground">{payload[0].name}</p>
        <p className="text-xs text-muted-foreground">{payload[0].value}%</p>
      </div>
    )
  }
  return null
}

export function CategoryPieChart({
  data,
}: {
  data: Array<{ name: string; value: number; color: string }>
}) {
  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="mb-1 text-sm font-semibold text-foreground">Threat Categories</h3>
      <p className="mb-5 text-xs text-muted-foreground">Distribution by fraud type</p>
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="h-48 w-48 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex w-full max-w-xs flex-col gap-2.5">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2.5">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-muted-foreground">{item.name}</span>
              <span className="text-xs font-medium text-foreground">{item.value}%</span>
            </div>
          ))}
          {data.length === 0 && (
            <p className="text-xs text-muted-foreground">No category data available yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
