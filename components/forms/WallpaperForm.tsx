"use client"

import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { wallpaperSchema, type WallpaperValues } from "@/lib/schemas"
import { useCategories } from "@/hooks/useCategories"
import { useSubcategories } from "@/hooks/useSubcategories"
import type { Wallpaper } from "@/types/wallpaper"
import type { WallpaperInput } from "@/services/wallpaper.service"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ImageUpload } from "@/components/shared/ImageUpload"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"

interface Props {
  wallpaper?: Wallpaper | null
  isSubmitting?: boolean
  onSubmit: (values: WallpaperInput) => void
  onCancel: () => void
}

export function WallpaperForm({ wallpaper, isSubmitting, onSubmit, onCancel }: Props) {
  const isEdit = Boolean(wallpaper)
  const [image, setImage] = useState<File | null>(null)

  const { data: categories = [] } = useCategories()
  const { data: subcategories = [] } = useSubcategories()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WallpaperValues>({
    resolver: zodResolver(wallpaperSchema),
    defaultValues: {
      category_id: wallpaper ? String(wallpaper.category_id) : "",
      subcategory_id: wallpaper ? String(wallpaper.subcategory_id) : "",
      wallpaper_type: (wallpaper?.wallpaper_type as "free" | "premium") || "free",
    },
  })

  const selectedCategory = watch("category_id")
  const selectedType = watch("wallpaper_type")

  // register selects manually
  useEffect(() => {
    register("category_id")
    register("subcategory_id")
    register("wallpaper_type")
  }, [register])

  const filteredSubs = useMemo(
    () => subcategories.filter((s) => String(s.category_id) === String(selectedCategory)),
    [subcategories, selectedCategory],
  )

  function submit(values: WallpaperValues) {
    onSubmit({
      id: wallpaper?.id,
      category_id: values.category_id,
      subcategory_id: values.subcategory_id,
      wallpaper_type: values.wallpaper_type,
      image,
    })
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-5">
      <div className="grid gap-2">
        <Label>Category</Label>
        <Select
          value={selectedCategory}
          onValueChange={(v) => {
            setValue("category_id", v, { shouldValidate: true })
            setValue("subcategory_id", "", { shouldValidate: false })
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.category_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category_id && <p className="text-sm text-destructive">{errors.category_id.message}</p>}
      </div>

      <div className="grid gap-2">
        <Label>Subcategory</Label>
        <Select
          value={watch("subcategory_id")}
          onValueChange={(v) => setValue("subcategory_id", v, { shouldValidate: true })}
          disabled={!selectedCategory}
        >
          <SelectTrigger>
            <SelectValue placeholder={selectedCategory ? "Select a subcategory" : "Select a category first"} />
          </SelectTrigger>
          <SelectContent>
            {filteredSubs.map((s) => (
              <SelectItem key={s.id} value={String(s.id)}>
                {s.subcategory_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.subcategory_id && <p className="text-sm text-destructive">{errors.subcategory_id.message}</p>}
      </div>

      <div className="grid gap-2">
        <Label>Wallpaper type</Label>
        <RadioGroup
          value={selectedType}
          onValueChange={(v) => setValue("wallpaper_type", v as "free" | "premium", { shouldValidate: true })}
          className="flex gap-6"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="free" id="type-free" />
            <Label htmlFor="type-free" className="font-normal cursor-pointer">
              Free
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="premium" id="type-premium" />
            <Label htmlFor="type-premium" className="font-normal cursor-pointer">
              Premium
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid gap-2">
        <Label>{isEdit ? "Replace image (optional)" : "Wallpaper image"}</Label>
        <ImageUpload
          initialUrl={wallpaper?.image_url || wallpaper?.image}
          onChange={setImage}
          aspect="aspect-[3/4]"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isEdit ? "Save changes" : "Add wallpaper"}
        </Button>
      </div>
    </form>
  )
}
