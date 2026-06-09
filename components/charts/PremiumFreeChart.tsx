"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PremiumFreeChartProps {
  premium: number
  free: number
}

export function PremiumFreeChart({ premium, free }: PremiumFreeChartProps) {
  const data = [
    { name: "Premium", value: premium },
    { name: "Free", value: free },
  ]
  const colors = ["var(--chart-1)", "var(--chart-2)"]
  const empty = premium + free === 0

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Premium vs Free</CardTitle>
      </CardHeader>
      <CardContent>
        {empty ? (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            No wallpaper data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={256}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={colors[i]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.5rem",
                  color: "var(--popover-foreground)",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
