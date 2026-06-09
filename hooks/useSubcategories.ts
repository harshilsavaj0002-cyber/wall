"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  createSubcategory,
  deleteSubcategory,
  getSubcategories,
  getSubcategoriesByCategory,
  updateSubcategory,
  type SubcategoryInput,
} from "@/services/subcategory.service"

export const subcategoryKeys = {
  all: ["subcategories"] as const,
  byCategory: (id: string | number) => ["subcategories", "by-category", String(id)] as const,
}

export function useSubcategories() {
  return useQuery({
    queryKey: subcategoryKeys.all,
    queryFn: getSubcategories,
  })
}

export function useSubcategoriesByCategory(categoryId?: string | number) {
  return useQuery({
    queryKey: subcategoryKeys.byCategory(categoryId ?? ""),
    queryFn: () => getSubcategoriesByCategory(categoryId as string | number),
    enabled: Boolean(categoryId),
  })
}

export function useCreateSubcategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: SubcategoryInput) => createSubcategory(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: subcategoryKeys.all })
      toast.success("Subcategory created")
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useUpdateSubcategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: SubcategoryInput) => updateSubcategory(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: subcategoryKeys.all })
      toast.success("Subcategory updated")
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useDeleteSubcategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string | number) => deleteSubcategory(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: subcategoryKeys.all })
      toast.success("Subcategory deleted")
    },
    onError: (e: Error) => toast.error(e.message),
  })
}
