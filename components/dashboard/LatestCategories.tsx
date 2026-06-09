import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { SafeImage } from "@/components/shared/SafeImage"
import type { Category } from "@/types/category"

interface Props {
  categories: Category[]
  loading?: boolean
}

export function LatestCategories({ categories, loading }: Props) {
  const latest = [...categories].slice(-5).reverse()

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Latest Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
        ) : latest.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No categories yet</p>
        ) : (
          latest.map((c) => (
            <div key={c.id} className="flex items-center gap-3">
              <SafeImage
                src={c.image_url || c.category_image}
                alt={c.category_name}
                className="size-10 shrink-0 rounded-lg"
                preview
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{c.category_name}</p>
                {(c.created_date || c.created_at) && (
                  <p className="text-xs text-muted-foreground">{c.created_date || c.created_at}</p>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
