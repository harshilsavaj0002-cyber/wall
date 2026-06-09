"use client"

import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAuthStore } from "@/store/auth-store"

export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const logout = useAuthStore((s) => s.logout)

  return () => {
    logout()
    queryClient.clear()
    toast.success("Signed out")
    router.replace("/login")
  }
}
