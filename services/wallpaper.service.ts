import api from "@/lib/api"
import { extractArray, getMessage, isSuccess } from "@/lib/normalize"
import type { Wallpaper } from "@/types/wallpaper"

export async function getWallpapers(): Promise<Wallpaper[]> {
  const { data } = await api.get("wallpaper/list.php")
  return extractArray<Wallpaper>(data)
}

export async function getWallpapersByCategory(categoryId: string | number): Promise<Wallpaper[]> {
  const { data } = await api.get("wallpaper/by_category.php", {
    params: { category_id: categoryId },
  })
  return extractArray<Wallpaper>(data)
}

export async function getPremiumWallpapers(): Promise<Wallpaper[]> {
  const { data } = await api.get("wallpaper/premium.php")
  return extractArray<Wallpaper>(data)
}

export interface WallpaperInput {
  id?: string | number
  category_id: string | number
  subcategory_id: string | number
  wallpaper_type: string
  image?: File | null
}

function toFormData(input: WallpaperInput) {
  const fd = new FormData()
  if (input.id !== undefined) fd.append("id", String(input.id))
  fd.append("category_id", String(input.category_id))
  fd.append("subcategory_id", String(input.subcategory_id))
  fd.append("wallpaper_type", input.wallpaper_type)
  if (input.image) fd.append("image", input.image)
  return fd
}

export async function createWallpaper(input: WallpaperInput) {
  const { data } = await api.post("wallpaper/add.php", toFormData(input))
  if (!isSuccess(data)) throw new Error(getMessage(data, "Failed to create wallpaper"))
  return data
}

export async function updateWallpaper(input: WallpaperInput) {
  const { data } = await api.post("wallpaper/update.php", toFormData(input))
  if (!isSuccess(data)) throw new Error(getMessage(data, "Failed to update wallpaper"))
  return data
}

export async function deleteWallpaper(id: string | number) {
  const fd = new FormData()
  fd.append("id", String(id))
  const { data } = await api.post("wallpaper/delete.php", fd)
  if (!isSuccess(data)) throw new Error(getMessage(data, "Failed to delete wallpaper"))
  return data
}
