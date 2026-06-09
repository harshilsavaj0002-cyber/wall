export type WallpaperType = "free" | "premium"

export interface Wallpaper {
  id: string | number
  category_id: string | number
  subcategory_id: string | number
  category_name?: string | null
  subcategory_name?: string | null
  image?: string | null
  image_url?: string | null
  wallpaper_type: WallpaperType | string
  created_date?: string | null
}
