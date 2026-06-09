"use client"

import { useMemo } from "react"
import { FolderTree, ImageIcon, Layers, Sparkles } from "lucide-react"

import { useCategories } from "@/hooks/useCategories"
import { useSubcategories } from "@/hooks/useSubcategories"
import { useWallpapers } from "@/hooks/useWallpapers"

import { PageHeader } from "@/components/shared/PageHeader"
import { StatCard } from "@/components/dashboard/StatCard"
import { PremiumFreeChart } from "@/components/charts/PremiumFreeChart"
import { WallpapersPerCategoryChart } from "@/components/charts/WallpapersPerCategoryChart"
import { LatestCategories } from "@/components/dashboard/LatestCategories"
import { RecentWallpapers } from "@/components/dashboard/RecentWallpapers"

export default function DashboardPage() {
  const { data: categories = [], isLoading: loadingCats } = useCategories()
  const { data: subcategories = [], isLoading: loadingSubs } = useSubcategories()
  const { data: wallpapers = [], isLoading: loadingWalls } = useWallpapers()

  const premiumCount = useMemo(
    () => wallpapers.filter((w) => String(w.wallpaper_type).toLowerCase() === "premium").length,
    [wallpapers],
  )
  const freeCount = wallpapers.length - premiumCount

  const perCategory = useMemo(() => {
    const map = new Map<string, number>()
    for (const w of wallpapers) {
      const name = w.category_name || `Category ${w.category_id}`
      map.set(name, (map.get(name) ?? 0) + 1)
    }
    // Fall back to category list so the chart shows known categories with 0 too.
    for (const c of categories) {
      if (!map.has(c.category_name)) map.set(c.category_name, map.get(c.category_name) ?? 0)
    }
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
  }, [wallpapers, categories])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your wallpaper catalog and recent activity."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Categories"
          value={categories.length}
          icon={FolderTree}
          loading={loadingCats}
        />
        <StatCard
          title="Total Subcategories"
          value={subcategories.length}
          icon={Layers}
          loading={loadingSubs}
          accent="text-chart-2 bg-chart-2/10"
        />
        <StatCard
          title="Total Wallpapers"
          value={wallpapers.length}
          icon={ImageIcon}
          loading={loadingWalls}
          accent="text-chart-4 bg-chart-4/10"
        />
        <StatCard
          title="Premium Wallpapers"
          value={premiumCount}
          icon={Sparkles}
          loading={loadingWalls}
          accent="text-chart-1 bg-chart-1/10"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <WallpapersPerCategoryChart data={perCategory} />
        <PremiumFreeChart premium={premiumCount} free={freeCount} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <LatestCategories categories={categories} loading={loadingCats} />
        </div>
        <div className="lg:col-span-2">
          <RecentWallpapers wallpapers={wallpapers} loading={loadingWalls} />
        </div>
      </div>
    </div>
  )
}
