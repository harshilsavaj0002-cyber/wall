// PHP backends return inconsistent shapes. These helpers extract usable data
// regardless of whether the payload is an array, { data: [] }, { result: [] }, etc.

export function extractArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[]
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>
    for (const key of ["data", "result", "results", "categories", "subcategories", "wallpapers", "list"]) {
      if (Array.isArray(obj[key])) return obj[key] as T[]
    }
  }
  return []
}

export function isSuccess(payload: unknown): boolean {
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>
    if (obj.success === true || obj.status === true) return true
    if (obj.status === "success" || obj.status === "1" || obj.status === 1) return true
    if (typeof obj.success === "undefined" && typeof obj.status === "undefined") return true
  }
  return Boolean(payload)
}

export function getMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>
    if (typeof obj.message === "string") return obj.message
  }
  return fallback
}
