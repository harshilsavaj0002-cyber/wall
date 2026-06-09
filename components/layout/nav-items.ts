import { LayoutDashboard, FolderTree, Layers, ImageIcon, Settings, type LucideIcon } from "lucide-react"

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Categories", href: "/categories", icon: FolderTree },
  { title: "Subcategories", href: "/subcategories", icon: Layers },
  { title: "Wallpapers", href: "/wallpapers", icon: ImageIcon },
  { title: "Settings", href: "/settings", icon: Settings },
]
