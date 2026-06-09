import { Suspense } from "react"
import { ImageIcon, Layers, ShieldCheck, Sparkles } from "lucide-react"
import { LoginForm } from "@/components/forms/LoginForm"

export default function LoginPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Brand / marketing panel */}
      <section className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-12 text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ImageIcon className="size-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">WallPack Admin</span>
        </div>

        <div className="max-w-md space-y-6">
          <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight">
            Manage your wallpaper catalog with ease.
          </h1>
          <p className="text-pretty leading-relaxed text-sidebar-foreground/70">
            Organize categories, curate collections and publish premium wallpapers from a single,
            powerful dashboard.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <Layers className="size-4 text-primary" />
              Categories &amp; subcategories management
            </li>
            <li className="flex items-center gap-3">
              <Sparkles className="size-4 text-primary" />
              Premium &amp; free wallpaper publishing
            </li>
            <li className="flex items-center gap-3">
              <ShieldCheck className="size-4 text-primary" />
              Secure, role-based admin access
            </li>
          </ul>
        </div>

        <p className="text-xs text-sidebar-foreground/50">
          © {new Date().getFullYear()} WallPack. All rights reserved.
        </p>
      </section>

      {/* Form panel */}
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 lg:hidden">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <ImageIcon className="size-5" />
              </div>
              <span className="text-lg font-semibold tracking-tight">WallPack Admin</span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">Sign in to your account</h2>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access the admin panel.
            </p>
          </div>

          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </section>
    </main>
  )
}
