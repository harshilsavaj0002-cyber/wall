"use client"

import { useEffect, useState } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { getQueryClient } from "@/lib/query-client"
import { useThemeStore } from "@/store/theme-store"
import { Toaster } from "@/components/ui/sonner"

function ThemeInitializer() {
  const theme = useThemeStore((s) => s.theme)
  useEffect(() => {
    const root = document.documentElement
    if (theme === "dark") root.classList.add("dark")
    else root.classList.remove("dark")
  }, [theme])
  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => getQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeInitializer />
      {children}
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  )
}
