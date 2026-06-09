import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { SafeImage } from "@/components/shared/SafeImage"
import type { Wallpaper } from "@/types/wallpaper"

interface Props {
  wallpapers: Wallpaper[]
  loading?: boolean
}

export function RecentWallpapers({ wallpapers, loading }: Props) {
  const recent = [...wallpapers].slice(-8).reverse()

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Recent Wallpapers</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] w-full rounded-lg" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No wallpapers yet</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {recent.map((w) => (
              <div key={w.id} className="group relative overflow-hidden rounded-lg border border-border">
                <SafeImage
                  src={w.image_url || w.image}
                  alt={`Wallpaper ${w.id}`}
                  className="aspect-[3/4] w-full"
                  preview
                />
                {String(w.wallpaper_type).toLowerCase() === "premium" && (
                  <Badge className="absolute left-1.5 top-1.5 bg-chart-1 text-white">Premium</Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
