"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface ImageModalProps {
  src: string
  alt: string
}

export function ImageModal({ src, alt }: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer">
          <Image
            src={src || "/placeholder.svg"}
            alt={alt}
            width={50}
            height={50}
            className="rounded-md hover:opacity-80 transition-opacity"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex justify-center items-center h-full">
          <Image
            src={src || "/placeholder.svg"}
            alt={alt}
            width={300}
            height={300}
            className="rounded-md"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
