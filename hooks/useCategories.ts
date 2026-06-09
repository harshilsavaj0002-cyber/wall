"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  type CategoryInput,
} from "@/services/category.service"

export const categoryKeys = {
  all: ["categories"] as const,
}

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: getCategories,
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CategoryInput) => createCategory(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.all })
      toast.success("Category created")
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CategoryInput) => updateCategory(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.all })
      toast.success("Category updated")
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string | number) => deleteCategory(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.all })
      toast.success("Category deleted")
    },
    onError: (e: Error) => toast.error(e.message),
  })
}
