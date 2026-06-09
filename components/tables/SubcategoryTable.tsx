"use client"

import { useEffect, useMemo, useState } from "react"
import { Layers, Pencil, Search, Trash2 } from "lucide-react"

import type { Subcategory } from "@/types/subcategory"
import type { Category } from "@/types/category"
import { useDebounce } from "@/hooks/useDebounce"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataPagination } from "@/components/shared/DataPagination"

const PAGE_SIZE = 8

interface SubcategoryTableProps {
  subcategories: Subcategory[]
  categories: Category[]
  loading?: boolean
  onEdit: (s: Subcategory) => void
  onDelete: (s: Subcategory) => void
}

export function SubcategoryTable({
  subcategories,
  categories,
  loading,
  onEdit,
  onDelete,
}: SubcategoryTableProps) {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [page, setPage] = useState(1)
  const debounced = useDebounce(search)

  const categoryName = (s: Subcategory) =>
    s.category_name || categories.find((c) => String(c.id) === String(s.category_id))?.category_name || "—"

  const filtered = useMemo(() => {
    const term = debounced.trim().toLowerCase()
    return subcategories.filter((s) => {
      const matchesSearch = !term || s.subcategory_name?.toLowerCase().includes(term)
      const matchesCategory = categoryFilter === "all" || String(s.category_id) === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [subcategories, debounced, categoryFilter])

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
            placeholder="Search subcategories..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={(v) => {
            setCategoryFilter(v)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Filter by category" />
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
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subcategory</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="ml-auto h-8 w-16" /></TableCell>
              </TableRow>
            ))
          ) : paged.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4}>
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Layers className="size-6" />
                  </div>
                  <p className="text-sm font-medium">No subcategories found</p>
                  <p className="text-sm text-muted-foreground">
                    {debounced || categoryFilter !== "all"
                      ? "Try adjusting your filters."
                      : "Create your first subcategory to get started."}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            paged.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.subcategory_name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{categoryName(s)}</Badge>
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  {s.created_date || s.created_at || "—"}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(s)} aria-label="Edit">
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(s)}
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
        <DataPagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
      )}
    </div>
  )
}
