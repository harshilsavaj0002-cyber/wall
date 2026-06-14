import axios from "axios"
import type { AxiosRequestConfig } from "axios"

// All requests go through the Next.js proxy route which forwards them to the
// PHP backend (http://wallpaper.soon.it/api). This avoids mixed-content
// and CORS issues in the browser.
export const api = axios.create({
  baseURL: "/api/proxy",
})

function removeContentTypeHeader(config: AxiosRequestConfig) {
  if (!config.headers) return

  if (typeof (config.headers as any).delete === "function") {
    ;(config.headers as any).delete("content-type")
    ;(config.headers as any).delete("Content-Type")
  } else {
    delete (config.headers as any)["content-type"]
    delete (config.headers as any)["Content-Type"]
  }
}

// Attach auth token (stored in localStorage) to every request.
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("wp_token")
    if (token) {
      if (!config.headers) config.headers = {}
      ;(config.headers as any).Authorization = `Bearer ${token}`
    }
  }

  if (config.data instanceof FormData) {
    removeContentTypeHeader(config)
  } else {
    if (!config.headers) config.headers = {}
    if (!(config.headers as any)["Content-Type"]) {
      ;(config.headers as any)["Content-Type"] = "application/json"
    }
  }

  return config
})

// Normalize errors so the UI can rely on a consistent message.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong. Please try again."

    if (error?.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("wp_token")
    }

    return Promise.reject(new Error(message))
  },
)

export default api
