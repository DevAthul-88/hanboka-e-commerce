"use client"
import { useMutation, useQuery } from "@blitzjs/rpc"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
import getColor from "../queries/getColor"
import deleteColor from "../mutations/deleteColor"

export const Color = ({ colorId }: { categoryId: number }) => {
  const router = useRouter()
  const [deleteCategoryMutation] = useMutation(deleteColor)
  const [category] = useQuery(getColor, { id: colorId })
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteCategoryMutation({ id: category.id })

      router.push("/admin/colors")
      toast.success("Category deleted successfully")
    } catch (error) {
      toast.error("Failed to delete category")
      setIsDeleting(false)
    }
  }

  const nameMapping: Record<string, string> = {
    name: "Name",
    hexCode: "Hex Code",
  }

  return (
    <>
      <Card className="w-full max-w-6xl mx-auto mt-4">
        <CardHeader>
          <CardTitle className="text-xl">
            <div className="flex flex-wrap justify-between align-middle items-center">
              <div>
                <h2 className=" text-2xl font-bold">Color</h2>
              </div>
              <div>
                <Link href={"/admin/colors"}>
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
              .filter(([key]) => key !== "id" && key !== "nameKorean") // Exclude specific keys
              .map(([key, value]) => {
                if (key === "hexCode") {
                  // Ensure that the value is treated as a string and not an object
                  value = String(value) // This converts the hex color code to a string if it's not already

                  return (
                    <div key={key} className="border-t border-gray-100 pt-4">
                      <dt className="font-medium text-gray-900 capitalize">{key}</dt>
                      <dd className="mt-2 text-sm text-gray-500 flex items-center">
                        {/* Display the color swatch and the hex value */}
                        <div
                          style={{
                            width: "24px",
                            height: "24px",
                            backgroundColor: value, // The background color will be the hex code
                            display: "inline-block",
                            marginRight: "8px",
                            borderRadius: "4px",
                          }}
                        ></div>
                        {value}
                      </dd>
                    </div>
                  )
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
                  This action cannot be undone. This will permanently delete the color "
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
