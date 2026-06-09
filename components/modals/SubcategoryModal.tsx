"use client"

import { useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SubcategoryForm } from "@/components/forms/SubcategoryForm"
import { useCreateSubcategory, useUpdateSubcategory } from "@/hooks/useSubcategories"
import type { Subcategory } from "@/types/subcategory"

interface SubcategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subcategory?: Subcategory | null
}

export function SubcategoryModal({ open, onOpenChange, subcategory }: SubcategoryModalProps) {
  const create = useCreateSubcategory()
  const update = useUpdateSubcategory()
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
          <DialogTitle>{subcategory ? "Edit subcategory" : "Add subcategory"}</DialogTitle>
          <DialogDescription>
            {subcategory
              ? "Update the subcategory details below."
              : "Create a new subcategory under a category."}
          </DialogDescription>
        </DialogHeader>
        <SubcategoryForm
          key={subcategory?.id ?? "new"}
          subcategory={subcategory}
          loading={loading}
          onCancel={() => onOpenChange(false)}
          onSubmit={(input) => {
            const action = subcategory ? update : create
            action.mutate(input, { onSuccess: () => onOpenChange(false) })
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
