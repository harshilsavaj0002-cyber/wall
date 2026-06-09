"use client"

import { usePathname } from "next/navigation"
import { MobileSidebar } from "./MobileSidebar"
import { ThemeToggle } from "./ThemeToggle"
import { NotificationDropdown } from "./NotificationDropdown"
import { ProfileDropdown } from "./ProfileDropdown"
import { navItems } from "./nav-items"

function useTitle() {
  const pathname = usePathname()
  const match = navItems.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  )
  return match?.title ?? "Dashboard"
}

export function Header() {
  const title = useTitle()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-sm lg:px-6">
      <div className="flex items-center gap-2">
        <MobileSidebar />
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <NotificationDropdown />
        <ProfileDropdown />
      </div>
    </header>
  )
}
