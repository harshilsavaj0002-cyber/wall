export interface Category {
  id: string | number
  category_name: string
  category_image?: string | null
  image_url?: string | null
  created_at?: string | null
  created_date?: string | null
}

export interface ApiResponse<T> {
  success?: boolean
  status?: boolean | string
  message?: string
  data?: T
}
