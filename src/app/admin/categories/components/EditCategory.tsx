"use client"
import { Suspense } from "react"
import updateCategory from "../mutations/updateCategory"
import getCategory from "../queries/getCategory"
import { UpdateCategorySchema } from "../schemas"
import { FORM_ERROR, CategoryForm } from "./CategoryForm"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import { Spinner } from "@/src/app/components/Loader"
import { toast } from "sonner"

export const EditCategory = ({ categoryId }: { categoryId: number }) => {
  const [category, { setQueryData }] = useQuery(
    getCategory,
    { id: categoryId },
    {
      staleTime: Infinity,
    }
  )
  const [updateCategoryMutation] = useMutation(updateCategory)
  const router = useRouter()

  // Transform category data to match form values type
  const initialValues = {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    isActive: category.isActive,
    sortOrder: category.sortOrder,
    parentId: category.parent?.id || null, // Extract parentId from parent object
  }

  return (
    <>
      <div>
        <Suspense
          fallback={
            <div className="mt-16">
              <Spinner />
            </div>
          }
        >
          <CategoryForm
            submitText="Update Category"
            schema={UpdateCategorySchema}
            initialValues={initialValues}
            onSubmit={async (values) => {
              try {
                const updated = await updateCategoryMutation({
                  ...values,
                  id: category.id,
                })
                await setQueryData(updated)
                toast("Category updated")
                router.refresh()
              } catch (error: any) {
                console.error(error)
                toast.error("Something went wrong, please try again later")
                return {
                  [FORM_ERROR]: error.toString(),
                }
              }
            }}
          />
        </Suspense>
      </div>
    </>
  )
}
