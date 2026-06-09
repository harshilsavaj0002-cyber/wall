import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
})
export type LoginValues = z.infer<typeof loginSchema>

export const categorySchema = z.object({
  category_name: z.string().min(2, "Category name must be at least 2 characters"),
})
export type CategoryValues = z.infer<typeof categorySchema>

export const subcategorySchema = z.object({
  category_id: z.string().min(1, "Please select a category"),
  subcategory_name: z.string().min(2, "Subcategory name must be at least 2 characters"),
})
export type SubcategoryValues = z.infer<typeof subcategorySchema>

export const wallpaperSchema = z.object({
  category_id: z.string().min(1, "Please select a category"),
  subcategory_id: z.string().min(1, "Please select a subcategory"),
  wallpaper_type: z.enum(["free", "premium"]),
})
export type WallpaperValues = z.infer<typeof wallpaperSchema>

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
})
export type ProfileValues = z.infer<typeof profileSchema>

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Required"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>
