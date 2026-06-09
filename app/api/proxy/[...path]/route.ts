import { type NextRequest, NextResponse } from "next/server"

// The real backend is served over plain HTTP. Browsers block HTTP requests from
// an HTTPS page (mixed content) and the backend may not send CORS headers, so we
// proxy every request server-side. The client talks to `/api/proxy/...` and this
// route forwards it to the PHP backend or to the file server for uploads.
const BACKEND_API_BASE_URL = "http://wallpaper.soon.it/api"
const BACKEND_ROOT_BASE_URL = "http://wallpaper.soon.it"

async function forward(req: NextRequest, path: string[]) {
  const search = req.nextUrl.search
  const baseUrl = path[0] === "uploads" ? BACKEND_ROOT_BASE_URL : BACKEND_API_BASE_URL
  const targetUrl = `${baseUrl}/${path.join("/")}${search}`

  const headers = new Headers()
  const contentType = req.headers.get("content-type")
  if (contentType) headers.set("content-type", contentType)
  const auth = req.headers.get("authorization")
  if (auth) headers.set("authorization", auth)

  const init: RequestInit = {
    method: req.method,
    headers,
    // Forward the raw body for non-GET requests (supports JSON and multipart/form-data)
    body: req.method === "GET" || req.method === "HEAD" ? undefined : await req.arrayBuffer(),
    redirect: "follow",
    // @ts-expect-error - duplex is required by Node fetch when sending a body
    duplex: "half",
  }

  try {
    const res = await fetch(targetUrl, init)
    const buffer = await res.arrayBuffer()
    const resContentType = res.headers.get("content-type") ?? "application/json"

    return new NextResponse(buffer, {
      status: res.status,
      headers: { "content-type": resContentType },
    })
  } catch (error) {
    console.log("[v0] Proxy error for", targetUrl, error)
    return NextResponse.json(
      { success: false, message: "Failed to reach backend server." },
      { status: 502 },
    )
  }
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params
  return forward(req, path)
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params
  return forward(req, path)
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params
  return forward(req, path)
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params
  return forward(req, path)
}
