import api from "@/lib/api"
import { extractArray, getMessage, isSuccess } from "@/lib/normalize"
import type { Category } from "@/types/category"

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get("category/list.php")
  return extractArray<Category>(data)
}

export interface CategoryInput {
  id?: string | number
  category_name: string
  category_image?: File | null
}

function toFormData(input: CategoryInput) {
  const fd = new FormData()
  if (input.id !== undefined) fd.append("id", String(input.id))
  fd.append("category_name", input.category_name)
  if (input.category_image) fd.append("category_image", input.category_image)
  return fd
}

export async function createCategory(input: CategoryInput) {
  const { data } = await api.post("category/add.php", toFormData(input))
  if (!isSuccess(data)) throw new Error(getMessage(data, "Failed to create category"))
  return data
}

export async function updateCategory(input: CategoryInput) {
  const { data } = await api.post("category/update.php", toFormData(input))
  if (!isSuccess(data)) throw new Error(getMessage(data, "Failed to update category"))
  return data
}

export async function deleteCategory(id: string | number) {
  const fd = new FormData()
  fd.append("id", String(id))
  const { data } = await api.post("category/delete.php", fd)
  if (!isSuccess(data)) throw new Error(getMessage(data, "Failed to delete category"))
  return data
}
