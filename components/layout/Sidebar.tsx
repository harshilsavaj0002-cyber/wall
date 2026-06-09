"use client"

import Link from "next/link"
import { ImageIcon } from "lucide-react"
import { SidebarNav } from "./SidebarNav"
import { useLogout } from "@/hooks/useLogout"

export function Sidebar() {
  const logout = useLogout()

  return (
    <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col">
      <Link
        href="/dashboard"
        className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6 text-sidebar-foreground"
      >
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <ImageIcon className="size-4" />
        </div>
        <span className="font-semibold tracking-tight">WallPack</span>
      </Link>
      <SidebarNav onLogout={logout} />
    </aside>
  )
}
