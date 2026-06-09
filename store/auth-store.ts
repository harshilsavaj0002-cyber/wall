import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface AuthUser {
  id?: string | number
  name?: string
  email?: string
  avatar?: string
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  hydrated: boolean
  setAuth: (token: string, user: AuthUser | null) => void
  updateUser: (user: Partial<AuthUser>) => void
  logout: () => void
  setHydrated: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      hydrated: false,
      setAuth: (token, user) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("wp_token", token)
          // Mirror to a cookie so middleware can read it on navigation.
          document.cookie = `wp_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`
        }
        set({ token, user, isAuthenticated: true })
      },
      updateUser: (user) => set({ user: { ...get().user, ...user } }),
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("wp_token")
          document.cookie = "wp_token=; path=/; max-age=0"
        }
        set({ token: null, user: null, isAuthenticated: false })
      },
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "wp-auth",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    },
  ),
)
