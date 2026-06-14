import api from "@/lib/api"
import { extractArray, getMessage, isSuccess } from "@/lib/normalize"
import type { Subcategory } from "@/types/subcategory"

export async function getSubcategories(): Promise<Subcategory[]> {
  const { data } = await api.get("subcategory/list.php")
  return extractArray<Subcategory>(data)
}

export async function getSubcategoriesByCategory(categoryId: string | number): Promise<Subcategory[]> {
  const { data } = await api.get("subcategory/by_category.php", {
    params: { category_id: categoryId },
  })
  return extractArray<Subcategory>(data)
}

export interface SubcategoryInput {
  id?: string | number
  category_id: string | number
  subcategory_name: string
}

function toFormData(input: SubcategoryInput) {
  const fd = new FormData()
  if (input.id !== undefined) fd.append("id", String(input.id))
  fd.append("category_id", String(input.category_id))
  fd.append("subcategory_name", input.subcategory_name)
  return fd
}

export async function createSubcategory(input: SubcategoryInput) {
  const { data } = await api.post("subcategory/add.php", toFormData(input))
  if (!isSuccess(data)) throw new Error(getMessage(data, "Failed to create subcategory"))
  return data
}

export async function updateSubcategory(input: SubcategoryInput) {
  const { data } = await api.post("subcategory/update.php", toFormData(input))
  if (!isSuccess(data)) throw new Error(getMessage(data, "Failed to update subcategory"))
  return data
}

export async function deleteSubcategory(id: string | number) {
  const fd = new FormData()
  fd.append("id", String(id))
  const { data } = await api.post("subcategory/delete.php", fd)
  if (!isSuccess(data)) throw new Error(getMessage(data, "Failed to delete subcategory"))
  return data
}
