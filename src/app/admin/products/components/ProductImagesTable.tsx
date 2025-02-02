"use client"

import { useState } from "react"
import Image from "next/image"
import { Trash2, Upload, ImageIcon, MoreHorizontal } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import UploadModal from "./UploadModal"
import { useQuery, useMutation } from "@blitzjs/rpc"
import getProduct from "../queries/getProduct"
import { toast } from "sonner"
import deleteImage from "../mutations/deleteImage"
import setMainImage from "../mutations/setMainImage"

interface ProductImage {
  id: number
  url: string
  isMain: boolean
}

export default function ProductImagesTable({ productId }: { productId: number }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<number | null>(null)
  const [product, { refetch }] = useQuery(getProduct, { id: productId })
  const [deleteImageMutation] = useMutation(deleteImage)
  const [setMainImageMutation] = useMutation(setMainImage)

  const handleDeleteImage = async (id: number) => {
    try {
      await deleteImageMutation({ id })
      toast.success("Image deleted successfully")
      refetch()
      setDeleteDialogOpen(false)
      setImageToDelete(null)
    } catch (error) {
      toast.error("Failed to delete image")
      console.error("Delete error:", error)
    }
  }

  const handleSetMainImage = async (id: number) => {
    try {
      await setMainImageMutation({ id, productId })
      toast.success("Main image updated")
      refetch()
    } catch (error) {
      toast.error("Failed to update main image")
      console.error("Set main image error:", error)
    }
  }

  const handleAddImage = async (newImage: ProductImage) => {
    refetch()
    setIsModalOpen(false)
  }

  const openDeleteDialog = (id: number) => {
    setImageToDelete(id)
    setDeleteDialogOpen(true)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Product Images</CardTitle>
        <Button onClick={() => setIsModalOpen(true)}>
          <Upload className="mr-2 h-4 w-4" /> Upload Image
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Main</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {product?.images.length > 0 ? (
              product?.images.map((image) => (
                <TableRow key={image.id}>
                  <TableCell>
                    <div className="relative h-20 w-20">
                      <Image
                        src={image.url || "/placeholder.svg"}
                        alt="Product image"
                        fill
                        className="rounded-md object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={image.isMain}
                      onCheckedChange={() => handleSetMainImage(image.id)}
                      id={`main-${image.id}`}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="destructive" onClick={() => openDeleteDialog(image.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">No images uploaded</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the image from both the
              database and Cloudinary storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => imageToDelete && handleDeleteImage(imageToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={productId}
        onUpload={handleAddImage}
      />
    </Card>
  )
}
