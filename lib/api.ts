import axios from "axios"

// All requests go through the Next.js proxy route which forwards them to the
// PHP backend (http://wallpaper.soon.it/api). This avoids mixed-content
// and CORS issues in the browser.
export const api = axios.create({
  baseURL: "/api/proxy",
  headers: {
    "Content-Type": "application/json",
  },
})

// Attach auth token (stored in localStorage) to every request.
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("wp_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
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
