"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  createWallpaper,
  deleteWallpaper,
  getWallpapers,
  updateWallpaper,
  type WallpaperInput,
} from "@/services/wallpaper.service"

export const wallpaperKeys = {
  all: ["wallpapers"] as const,
}

export function useWallpapers() {
  return useQuery({
    queryKey: wallpaperKeys.all,
    queryFn: getWallpapers,
  })
}

export function useCreateWallpaper() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: WallpaperInput) => createWallpaper(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: wallpaperKeys.all })
      toast.success("Wallpaper created")
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useUpdateWallpaper() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: WallpaperInput) => updateWallpaper(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: wallpaperKeys.all })
      toast.success("Wallpaper updated")
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useDeleteWallpaper() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string | number) => deleteWallpaper(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: wallpaperKeys.all })
      toast.success("Wallpaper deleted")
    },
    onError: (e: Error) => toast.error(e.message),
  })
}
