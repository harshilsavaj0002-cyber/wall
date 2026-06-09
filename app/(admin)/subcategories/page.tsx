"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { useCategories } from "@/hooks/useCategories"
import { useSubcategories, useDeleteSubcategory } from "@/hooks/useSubcategories"
import type { Subcategory } from "@/types/subcategory"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { SubcategoryTable } from "@/components/tables/SubcategoryTable"
import { SubcategoryModal } from "@/components/modals/SubcategoryModal"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"

export default function SubcategoriesPage() {
  const { data: subcategories = [], isLoading } = useSubcategories()
  const { data: categories = [] } = useCategories()
  const del = useDeleteSubcategory()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Subcategory | null>(null)
  const [deleting, setDeleting] = useState<Subcategory | null>(null)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subcategories"
        description="Organize wallpapers into subcategories within each category."
        action={
          <Button
            onClick={() => {
              setEditing(null)
              setModalOpen(true)
            }}
          >
            <Plus className="size-4" />
            Add subcategory
          </Button>
        }
      />

      <SubcategoryTable
        subcategories={subcategories}
        categories={categories}
        loading={isLoading}
        onEdit={(s) => {
          setEditing(s)
          setModalOpen(true)
        }}
        onDelete={(s) => setDeleting(s)}
      />

      <SubcategoryModal
        open={modalOpen}
        onOpenChange={(o) => {
          setModalOpen(o)
          if (!o) setEditing(null)
        }}
        subcategory={editing}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Delete subcategory"
        description={`Are you sure you want to delete "${deleting?.subcategory_name}"? This action cannot be undone.`}
        loading={del.isPending}
        onConfirm={() => {
          if (!deleting) return
          del.mutate(deleting.id, { onSuccess: () => setDeleting(null) })
        }}
      />
    </div>
  )
}
