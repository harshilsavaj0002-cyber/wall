"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import { subcategorySchema, type SubcategoryValues } from "@/lib/schemas"
import type { Subcategory } from "@/types/subcategory"
import type { SubcategoryInput } from "@/services/subcategory.service"
import { useCategories } from "@/hooks/useCategories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SubcategoryFormProps {
  subcategory?: Subcategory | null
  loading?: boolean
  onSubmit: (input: SubcategoryInput) => void
  onCancel: () => void
}

export function SubcategoryForm({ subcategory, loading, onSubmit, onCancel }: SubcategoryFormProps) {
  const { data: categories = [] } = useCategories()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SubcategoryValues>({
    resolver: zodResolver(subcategorySchema),
    defaultValues: {
      category_id: subcategory?.category_id ? String(subcategory.category_id) : "",
      subcategory_name: subcategory?.subcategory_name ?? "",
    },
  })

  const categoryId = watch("category_id")

  return (
    <form
      onSubmit={handleSubmit((values) =>
        onSubmit({
          id: subcategory?.id,
          category_id: values.category_id,
          subcategory_name: values.subcategory_name,
        }),
      )}
      className="space-y-5"
    >
      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={categoryId} onValueChange={(v) => setValue("category_id", v, { shouldValidate: true })}>
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

      <div className="space-y-2">
        <Label htmlFor="subcategory_name">Subcategory name</Label>
        <Input id="subcategory_name" placeholder="e.g. Mountains" {...register("subcategory_name")} />
        {errors.subcategory_name && (
          <p className="text-sm text-destructive">{errors.subcategory_name.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="size-4 animate-spin" />}
          {subcategory ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  )
}
