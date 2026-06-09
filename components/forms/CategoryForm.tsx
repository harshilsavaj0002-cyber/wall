"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import { categorySchema, type CategoryValues } from "@/lib/schemas"
import type { Category } from "@/types/category"
import type { CategoryInput } from "@/services/category.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageUpload } from "@/components/shared/ImageUpload"

interface CategoryFormProps {
  category?: Category | null
  loading?: boolean
  onSubmit: (input: CategoryInput) => void
  onCancel: () => void
}

export function CategoryForm({ category, loading, onSubmit, onCancel }: CategoryFormProps) {
  const [image, setImage] = useState<File | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { category_name: category?.category_name ?? "" },
  })

  return (
    <form
      onSubmit={handleSubmit((values) =>
        onSubmit({ id: category?.id, category_name: values.category_name, image }),
      )}
      className="space-y-5"
    >
      <div className="space-y-2">
        <Label htmlFor="category_name">Category name</Label>
        <Input id="category_name" placeholder="e.g. Nature" {...register("category_name")} />
        {errors.category_name && (
          <p className="text-sm text-destructive">{errors.category_name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Category image</Label>
        <ImageUpload
          initialUrl={category?.image_url || category?.category_image}
          onChange={setImage}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="size-4 animate-spin" />}
          {category ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  )
}
