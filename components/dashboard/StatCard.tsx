import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: number
  icon: LucideIcon
  loading?: boolean
  accent?: string
}

export function StatCard({ title, value, icon: Icon, loading, accent = "text-primary bg-primary/10" }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-xl", accent)}>
          <Icon className="size-6" />
        </div>
        <div className="min-w-0 space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          {loading ? (
            <Skeleton className="h-7 w-16" />
          ) : (
            <p className="text-2xl font-semibold tracking-tight">{value.toLocaleString()}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
