import { type NextRequest, NextResponse } from "next/server"

const PROTECTED_PREFIXES = ["/dashboard", "/categories", "/subcategories", "/wallpapers", "/settings"]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get("wp_token")?.value

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  )

  // Redirect unauthenticated users away from protected pages.
  if (isProtected && !token) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users away from the login page.
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/categories/:path*",
    "/subcategories/:path*",
    "/wallpapers/:path*",
    "/settings/:path*",
    "/login",
  ],
}
