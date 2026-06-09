"use client"

import { useState } from "react"
import { ImageIcon, X as CloseIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog"

interface SafeImageProps {
  src?: string | null
  alt: string
  className?: string
  preview?: boolean
}

function normalizeImageSrc(src?: string | null) {
  if (!src) return undefined

  try {
    const url = new URL(src)
    if (url.hostname === "wallpaper.soon.it") {
      return `/api/proxy${url.pathname}${url.search}`
    }
  } catch {
    // Ignore invalid URL and use the original string.
  }

  return src
}

/**
 * Renders an external image with a graceful fallback when the URL is missing
 * or fails to load (common with remote PHP-served assets).
 */
export function SafeImage({ src, alt, className, preview }: SafeImageProps) {
  const [errored, setErrored] = useState(false)

  const imageSrc = normalizeImageSrc(src)

  if (!imageSrc || errored) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          className,
        )}
        aria-label={alt}
      >
        <ImageIcon className="size-5" />
      </div>
    )
  }

  const [previewOpen, setPreviewOpen] = useState(false)

  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageSrc}
      alt={alt}
      onError={() => setErrored(true)}
      onClick={preview ? () => setPreviewOpen(true) : undefined}
      className={cn(
        "h-full w-full object-cover",
        preview && "cursor-zoom-in",
        className,
      )}
    />
  )

  return (
    <>
      {image}
      {preview && (
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-transparent shadow-none">
            <div className="relative flex min-h-[40vh] items-center justify-center overflow-hidden rounded-xl bg-black/90">
              <DialogClose className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-white shadow-lg hover:bg-black/80 focus-visible:ring-ring focus-visible:outline-none">
                <CloseIcon className="size-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
              <img
                src={imageSrc}
                alt={alt}
                className="max-h-[90vh] max-w-[90vw] object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
