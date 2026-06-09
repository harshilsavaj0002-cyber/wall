"use client"

import { Crown, Pencil, Trash2 } from "lucide-react"
import { SafeImage } from "@/components/shared/SafeImage"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Wallpaper } from "@/types/wallpaper"

interface Props {
  wallpaper: Wallpaper
  onEdit: (w: Wallpaper) => void
  onDelete: (w: Wallpaper) => void
}

export function WallpaperCard({ wallpaper, onEdit, onDelete }: Props) {
  const isPremium = String(wallpaper.wallpaper_type).toLowerCase() === "premium"

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <SafeImage
          src={wallpaper.image_url || wallpaper.image}
          alt={`Wallpaper ${wallpaper.id}`}
          className="size-full transition-transform duration-300 group-hover:scale-105"
          preview
        />
        <div className="absolute left-2 top-2">
          {isPremium ? (
            <Badge className="gap-1 bg-amber-500 text-white hover:bg-amber-500">
              <Crown className="size-3" />
              Premium
            </Badge>
          ) : (
            <Badge variant="secondary">Free</Badge>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-1.5 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            size="icon"
            variant="secondary"
            className="size-8"
            onClick={() => onEdit(wallpaper)}
            aria-label="Edit wallpaper"
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            className="size-8"
            onClick={() => onDelete(wallpaper)}
            aria-label="Delete wallpaper"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-0.5 p-3">
        <p className="truncate text-sm font-medium text-foreground">
          {wallpaper.category_name || `Category ${wallpaper.category_id}`}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {wallpaper.subcategory_name || `Subcategory ${wallpaper.subcategory_id}`}
        </p>
      </div>
    </div>
  )
}
