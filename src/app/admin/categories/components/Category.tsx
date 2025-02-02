"use client"
import { useMutation, useQuery } from "@blitzjs/rpc"
import Link from "next/link"
import { useRouter } from "next/navigation"
import deleteCategory from "../mutations/deleteCategory"
import getCategory from "../queries/getCategory"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { ArrowLeft, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export const Category = ({ categoryId }: { categoryId: number }) => {
  const router = useRouter()
  const [deleteCategoryMutation] = useMutation(deleteCategory)
  const [category] = useQuery(getCategory, { id: categoryId })
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteCategoryMutation({ id: category.id })

      router.push("/admin/categories")
      toast.success("Category deleted successfully")
    } catch (error) {
      toast.error("Failed to delete category")
      setIsDeleting(false)
    }
  }

  const nameMapping: Record<string, string> = {
    isActive: "Status",
    sortOrder: "Display Order",
    parentId: "Parent Category",
    name: "Name",
    slug: "Slug",
    description: "Description",
  }

  return (
    <>
      <Card className="w-full max-w-6xl mx-auto mt-4">
        <CardHeader>
          <CardTitle className="text-xl">
            <div className="flex flex-wrap justify-between align-middle items-center">
              <div>
                <h2 className=" text-2xl font-bold">Categories</h2>
              </div>
              <div>
                <Link href={"/admin/categories"}>
                  <Button>
                    <ArrowLeft /> Back
                  </Button>
                </Link>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            {Object.entries(category)
              .filter(([key]) => key !== "id" && key !== "imageUrl") // Exclude specific keys
              .map(([key, value]) => {
                // Formatting specific fields
                if (key === "isActive") {
                  value = value ? "Active" : "Inactive"
                } else if (key === "sortOrder" || key === "parentId") {
                  value = value !== null && value !== undefined ? value.toString() : "N/A" // Ensure valid value for these fields
                } else if (key === "description") {
                  value = value?.description ?? "N/A"
                } else if (key === "parent") {
                  value = value?.name ?? "N/A"
                }

                const displayName = nameMapping[key] || key
                return (
                  <div key={key} className="border-t border-gray-100 pt-4">
                    <dt className="font-medium text-gray-900 capitalize">{displayName}</dt>
                    <dd className="mt-2 text-sm text-gray-500">{value?.toString() ?? "N/A"}</dd>
                  </div>
                )
              })}
          </dl>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button asChild variant="outline">
            <Link href={`/admin/categories/${category.id}/edit`}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Link>
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
        </CardFooter>
      </Card>
    </>
  )
}
