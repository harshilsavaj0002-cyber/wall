"use client"

import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { useDeleteCategory } from "@/hooks/useCategories"
import type { Category } from "@/types/category"

interface DeleteCategoryModalProps {
  category: Category | null
  onOpenChange: (open: boolean) => void
}

export function DeleteCategoryModal({ category, onOpenChange }: DeleteCategoryModalProps) {
  const del = useDeleteCategory()

  return (
    <ConfirmDialog
      open={!!category}
      onOpenChange={(o) => !o && onOpenChange(false)}
      title="Delete category"
      description={`Are you sure you want to delete "${category?.category_name}"? This action cannot be undone.`}
      loading={del.isPending}
      onConfirm={() => {
        if (!category) return
        del.mutate(category.id, { onSuccess: () => onOpenChange(false) })
      }}
    />
  )
}
