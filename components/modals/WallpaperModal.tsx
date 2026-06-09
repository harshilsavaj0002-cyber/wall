"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { WallpaperForm } from "@/components/forms/WallpaperForm"
import { useCreateWallpaper, useUpdateWallpaper } from "@/hooks/useWallpapers"
import type { Wallpaper } from "@/types/wallpaper"
import type { WallpaperInput } from "@/services/wallpaper.service"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  wallpaper?: Wallpaper | null
}

export function WallpaperModal({ open, onOpenChange, wallpaper }: Props) {
  const create = useCreateWallpaper()
  const update = useUpdateWallpaper()
  const isEdit = Boolean(wallpaper)
  const isSubmitting = create.isPending || update.isPending

  function handleSubmit(values: WallpaperInput) {
    const mutation = isEdit ? update : create
    mutation.mutate(values, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit wallpaper" : "Add wallpaper"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the wallpaper details below." : "Upload a new wallpaper and assign it to a category."}
          </DialogDescription>
        </DialogHeader>
        <WallpaperForm
          wallpaper={wallpaper}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
