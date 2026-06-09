"use client"

import { Moon, Sun } from "lucide-react"
import { useThemeStore } from "@/store/theme-store"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function AppearanceCard() {
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)
  const isDark = theme === "dark"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Customize how the admin panel looks on this device.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              {isDark ? <Moon className="size-5" /> : <Sun className="size-5" />}
            </div>
            <div>
              <Label htmlFor="dark-mode" className="text-sm font-medium">
                Dark mode
              </Label>
              <p className="text-sm text-muted-foreground">Toggle between light and dark themes.</p>
            </div>
          </div>
          <Switch
            id="dark-mode"
            checked={isDark}
            onCheckedChange={(c) => setTheme(c ? "dark" : "light")}
          />
        </div>
      </CardContent>
    </Card>
  )
}
