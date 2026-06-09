"use client"

import { useEffect, useMemo, useState } from "react"
import { Plus, Search, ImageIcon } from "lucide-react"
import { PageHeader } from "@/components/shared/PageHeader"
import { WallpaperCard } from "@/components/tables/WallpaperCard"
import { WallpaperModal } from "@/components/modals/WallpaperModal"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { DataPagination } from "@/components/shared/DataPagination"
import { useWallpapers, useDeleteWallpaper } from "@/hooks/useWallpapers"
import { useCategories } from "@/hooks/useCategories"
import type { Wallpaper } from "@/types/wallpaper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const PAGE_SIZE = 12

export default function WallpapersPage() {
  const { data: wallpapers = [], isLoading } = useWallpapers()
  const { data: categories = [] } = useCategories()
  const deleteMutation = useDeleteWallpaper()

  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [page, setPage] = useState(1)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Wallpaper | null>(null)
  const [toDelete, setToDelete] = useState<Wallpaper | null>(null)

  const filtered = useMemo(() => {
    return wallpapers.filter((w) => {
      const matchesCategory =
        categoryFilter === "all" || String(w.category_id) === categoryFilter
      const matchesType =
        typeFilter === "all" || String(w.wallpaper_type).toLowerCase() === typeFilter
      const haystack = `${w.category_name ?? ""} ${w.subcategory_name ?? ""} ${w.id}`.toLowerCase()
      const matchesSearch = haystack.includes(search.toLowerCase())
      return matchesCategory && matchesType && matchesSearch
    })
  }, [wallpapers, categoryFilter, typeFilter, search])

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [filtered.length, page])

  function openCreate() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(w: Wallpaper) {
    setEditing(w)
    setModalOpen(true)
  }

  function resetPage<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v)
      setPage(1)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Wallpapers"
        description="Browse, upload and manage all wallpapers in your library."
        action={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Add wallpaper
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => resetPage(setSearch)(e.target.value)}
            placeholder="Search wallpapers..."
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={resetPage(setCategoryFilter)}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.category_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={resetPage(setTypeFilter)}>
          <SelectTrigger className="sm:w-36">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-20 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <ImageIcon className="size-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">No wallpapers found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters or add a new wallpaper.</p>
          </div>
          <Button onClick={openCreate} variant="outline">
            <Plus className="size-4" />
            Add wallpaper
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {paged.map((w) => (
              <WallpaperCard key={w.id} wallpaper={w} onEdit={openEdit} onDelete={setToDelete} />
            ))}
          </div>
          <DataPagination
            page={page}
            pageSize={PAGE_SIZE}
            total={filtered.length}
            onPageChange={setPage}
          />
        </>
      )}

      <WallpaperModal open={modalOpen} onOpenChange={setModalOpen} wallpaper={editing} />

      <ConfirmDialog
        open={Boolean(toDelete)}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Delete wallpaper"
        description="This wallpaper will be permanently removed. This action cannot be undone."
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (!toDelete) return
          deleteMutation.mutate(toDelete.id, { onSuccess: () => setToDelete(null) })
        }}
      />
    </div>
  )
}
