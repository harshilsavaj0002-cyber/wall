"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { useCategories } from "@/hooks/useCategories"
import type { Category } from "@/types/category"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { CategoryTable } from "@/components/tables/CategoryTable"
import { CategoryModal } from "@/components/modals/CategoryModal"
import { DeleteCategoryModal } from "@/components/modals/DeleteCategoryModal"

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [deleting, setDeleting] = useState<Category | null>(null)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Manage the top-level categories for your wallpapers."
        action={
          <Button
            onClick={() => {
              setEditing(null)
              setModalOpen(true)
            }}
          >
            <Plus className="size-4" />
            Add category
          </Button>
        }
      />

      <CategoryTable
        categories={categories}
        loading={isLoading}
        onEdit={(c) => {
          setEditing(c)
          setModalOpen(true)
        }}
        onDelete={(c) => setDeleting(c)}
      />

      <CategoryModal
        open={modalOpen}
        onOpenChange={(o) => {
          setModalOpen(o)
          if (!o) setEditing(null)
        }}
        category={editing}
      />

      <DeleteCategoryModal category={deleting} onOpenChange={() => setDeleting(null)} />
    </div>
  )
}
