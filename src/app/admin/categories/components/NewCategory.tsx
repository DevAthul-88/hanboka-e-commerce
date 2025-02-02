"use client"
import { FORM_ERROR, CategoryForm } from "./CategoryForm"
import { CreateCategorySchema } from "../schemas"
import { useMutation } from "@blitzjs/rpc"
import createCategory from "../mutations/createCategory"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function New__ModelName() {
  const [createCategoryMutation] = useMutation(createCategory)
  const router = useRouter()
  return (
    <CategoryForm
      submitText="Create Category"
      schema={CreateCategorySchema}
      initialValues={{
        name: "",
        slug: "",
        description: "",
        isActive: true,
        sortOrder: 0,
        parentId: null,
      }}
      onSubmit={async (values) => {
        try {
          const category = await createCategoryMutation(values)
          router.push(`/admin/categories/${category.id}`)
          toast.success("Category created successfully")
        } catch (error: any) {
          console.error(error)
          return {
            [FORM_ERROR]: error.toString(),
          }
        }
      }}
    />
  )
}
