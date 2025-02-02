"use client"

import { useState } from "react"
import Image from "next/image"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUploadProductImage } from "@/hooks/image-upload"

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  productId: number
  onUpload: (image: { id: number; url: string; isMain: boolean }) => void
}

export default function UploadModal({ isOpen, onClose, productId, onUpload }: UploadModalProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { upload } = useUploadProductImage()
  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    if (selectedFile) {
      setIsUploading(true)
      try {
        const image = await upload({
          file: selectedFile,
          productId,
          isMain: false,
        })
        onUpload(image)
        setPreviewImage(null)
        setSelectedFile(null)
        onClose()
      } catch (error) {
        console.error("Upload failed:", error)
      } finally {
        setIsUploading(false)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
          <DialogDescription>
            Upload a new image for your product. Click or drag and drop an image file below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center">
            {previewImage ? (
              <div className="relative h-64 w-full">
                <Image src={previewImage} alt="Preview" fill className="rounded-lg object-cover" />
              </div>
            ) : (
              <Label htmlFor="image-upload" className="cursor-pointer w-full">
                <div className="flex items-center justify-center w-full h-64 border-2 border-dashed border-muted-foreground rounded-lg hover:bg-muted transition-colors duration-200">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Click or drag and drop to upload an image
                    </p>
                  </div>
                </div>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </Label>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedFile || isUploading}>
            {isUploading ? "Uploading..." : "Upload Image"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
