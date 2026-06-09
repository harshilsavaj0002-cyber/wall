"use client"

import { useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CategoryForm } from "@/components/forms/CategoryForm"
import { useCreateCategory, useUpdateCategory } from "@/hooks/useCategories"
import type { Category } from "@/types/category"

interface CategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
}

export function CategoryModal({ open, onOpenChange, category }: CategoryModalProps) {
  const create = useCreateCategory()
  const update = useUpdateCategory()
  const loading = create.isPending || update.isPending

  useEffect(() => {
    if (!open) {
      create.reset()
      update.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? "Edit category" : "Add category"}</DialogTitle>
          <DialogDescription>
            {category
              ? "Update the category details below."
              : "Create a new category for organizing wallpapers."}
          </DialogDescription>
        </DialogHeader>
        <CategoryForm
          key={category?.id ?? "new"}
          category={category}
          loading={loading}
          onCancel={() => onOpenChange(false)}
          onSubmit={(input) => {
            const action = category ? update : create
            action.mutate(input, { onSuccess: () => onOpenChange(false) })
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
