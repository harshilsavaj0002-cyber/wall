"use client"

import { useState } from "react"
import { ImageIcon, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { SidebarNav } from "./SidebarNav"
import { useLogout } from "@/hooks/useLogout"

export function MobileSidebar() {
  const [open, setOpen] = useState(false)
  const logout = useLogout()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 border-sidebar-border bg-sidebar p-0">
        <SheetTitle className="sr-only">Navigation menu</SheetTitle>
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6 text-sidebar-foreground">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ImageIcon className="size-4" />
          </div>
          <span className="font-semibold tracking-tight">WallPack</span>
        </div>
        <SidebarNav
          onNavigate={() => setOpen(false)}
          onLogout={() => {
            setOpen(false)
            logout()
          }}
        />
      </SheetContent>
    </Sheet>
  )
}
