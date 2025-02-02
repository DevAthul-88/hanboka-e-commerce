"use client"
import { useMutation, useQuery } from "@blitzjs/rpc"
import Link from "next/link"
import { useRouter } from "next/navigation"
import deleteProduct from "../mutations/deleteProduct"
import getProduct from "../queries/getProduct"
import ProductDetails from "./ProductDetails"
import { Button } from "@/src/app/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { Pen, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

export const Product = ({ productId }: { productId: number }) => {
  const router = useRouter()
  const [deleteProductMutation] = useMutation(deleteProduct)
  const [product] = useQuery(getProduct, { id: productId })
  const [category] = useQuery(getProduct, { id: productId })
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteProductMutation({ id: category.id })

      router.push("/admin/products")
      toast.success("Product deleted successfully")
    } catch (error) {
      toast.error("Failed to delete product")
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div>
        <div className="flex justify-end items-center">
          <div></div>
          <div className=" flex gap-2">
            <Button
              type="button"
              onClick={async () => {
                router.push(`/admin/products/${product.id}/images`)
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Images
            </Button>

            <Button
              type="button"
              onClick={async () => {
                router.push(`/admin/products/${product.id}/edit`)
              }}
            >
              <Pen className="w-4 h-4 mr-2" />
              Edit
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the category "
                    {category?.name}" and remove its data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <ProductDetails productData={product} />
      </div>
    </>
  )
}
