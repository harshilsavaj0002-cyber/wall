"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowUpDown, FolderTree, Pencil, Search, Trash2 } from "lucide-react"

import type { Category } from "@/types/category"
import { useDebounce } from "@/hooks/useDebounce"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SafeImage } from "@/components/shared/SafeImage"
import { DataPagination } from "@/components/shared/DataPagination"

const PAGE_SIZE = 8

interface CategoryTableProps {
  categories: Category[]
  loading?: boolean
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}

export function CategoryTable({ categories, loading, onEdit, onDelete }: CategoryTableProps) {
  const [search, setSearch] = useState("")
  const [sortAsc, setSortAsc] = useState(true)
  const [page, setPage] = useState(1)
  const debounced = useDebounce(search)

  const filtered = useMemo(() => {
    const term = debounced.trim().toLowerCase()
    let rows = categories
    if (term) {
      rows = rows.filter((c) => c.category_name?.toLowerCase().includes(term))
    }
    return [...rows].sort((a, b) => {
      const cmp = (a.category_name ?? "").localeCompare(b.category_name ?? "")
      return sortAsc ? cmp : -cmp
    })
  }, [categories, debounced, sortAsc])

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [filtered.length, page])

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-9"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Image</TableHead>
            <TableHead>
              <button
                onClick={() => setSortAsc((v) => !v)}
                className="flex items-center gap-1 hover:text-foreground"
              >
                Name
                <ArrowUpDown className="size-3.5" />
              </button>
            </TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="size-12 rounded-lg" /></TableCell>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="ml-auto h-8 w-16" /></TableCell>
              </TableRow>
            ))
          ) : paged.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4}>
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <FolderTree className="size-6" />
                  </div>
                  <p className="text-sm font-medium">No categories found</p>
                  <p className="text-sm text-muted-foreground">
                    {debounced ? "Try a different search term." : "Create your first category to get started."}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            paged.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <SafeImage
                    src={c.image_url || c.category_image}
                    alt={c.category_name}
                    className="size-12 rounded-lg"
                    preview
                  />
                </TableCell>
                <TableCell className="font-medium">{c.category_name}</TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  {c.created_date || c.created_at || "—"}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(c)} aria-label="Edit">
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(c)}
                      aria-label="Delete"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {!loading && filtered.length > 0 && (
        <DataPagination
          page={page}
          pageSize={PAGE_SIZE}
          total={filtered.length}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}
