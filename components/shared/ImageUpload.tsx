"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ImagePlus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  /** Existing remote image URL (edit mode) */
  initialUrl?: string
  onChange: (file: File | null) => void
  className?: string
  aspect?: string
}

function normalizeImageUrl(url?: string) {
  if (!url) return undefined

  try {
    const parsed = new URL(url)
    if (parsed.hostname === "wallpaper.soon.it") {
      return `/api/proxy${parsed.pathname}${parsed.search}`
    }
  } catch {
    // Keep original string for relative URLs or invalid URL values.
  }

  return url
}

export function ImageUpload({ initialUrl, onChange, className, aspect = "aspect-video" }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const normalizedInitialUrl = useMemo(() => normalizeImageUrl(initialUrl), [initialUrl])
  const [preview, setPreview] = useState<string | undefined>(normalizedInitialUrl)

  useEffect(() => {
    setPreview(normalizedInitialUrl)
  }, [normalizedInitialUrl])

  function handleFile(file: File | null) {
    onChange(file)
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
    } else {
      setPreview(normalizedInitialUrl)
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {preview ? (
        <div className={cn("relative overflow-hidden rounded-lg border border-border", aspect)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" crossOrigin="anonymous" />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute right-2 top-2 size-7"
            onClick={() => {
              handleFile(null)
              setPreview(undefined)
              if (inputRef.current) inputRef.current.value = ""
            }}
            aria-label="Remove image"
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/40 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted",
            aspect,
          )}
        >
          <ImagePlus className="size-6" />
          <span className="text-sm">Click to upload image</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
      {preview && (
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          Change image
        </Button>
      )}
    </div>
  )
}
