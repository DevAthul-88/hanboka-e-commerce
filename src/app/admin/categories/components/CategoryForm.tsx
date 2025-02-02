// First, let's add the LabeledSelectField as discussed earlier
import { LabeledCheckboxField } from "@/src/app/components/LabeledCheckboxField"
import { LabeledSelectField } from "@/src/app/components/LabeledSelectField"
import { useQuery } from "@blitzjs/rpc"
import React from "react"
import { Form, type FormProps } from "src/app/components/Form"
import { LabeledTextField } from "src/app/components/LabeledTextField"
import { LabeledSlugField } from "@/src/app/components/LabeledSlugField"
import getCategories from "../queries/getCategories"
import { useParams } from "next/navigation"
export { FORM_ERROR } from "src/app/components/Form"

export function CategoryForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const categories = useQuery(getCategories, {})
  const { categoryId } = useParams() // Get URL query parameters

  // Extract the ID from the URL
  const urlCategoryId = categoryId ? Number(categoryId) : null

  // Transform categories for select options and filter out the category with the current id
  const categoryOptions =
    categories?.[0]?.categories
      .filter((category) => category.id !== urlCategoryId) // Exclude the category with the current URL ID
      .map((category) => ({
        label: category.name,
        value: Number(category.id),
      })) || []

  // Add "None" option for top-level categories
  categoryOptions.unshift({ label: "None (Top Level)", value: "" })

  return (
    <div>
      <Form<S> {...props}>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <LabeledTextField
            name="name"
            label="Category Name"
            placeholder="Enter category name"
            type="text"
          />
          <LabeledSlugField
            name="slug"
            label="URL Slug"
            placeholder="url-friendly-name"
            sourceField="name"
          />
          <div className="col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2">
            <LabeledTextField
              name="description"
              label="Description"
              placeholder="Enter category description"
              type="text"
            />
          </div>
          <LabeledSelectField name="parentId" label="Parent Category" options={categoryOptions} />
          <LabeledTextField
            name="sortOrder"
            label="Display Order"
            placeholder="Enter display order (e.g., 1, 2, 3)"
            type="number"
          />
          <div className="col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2">
            <LabeledCheckboxField name="isActive" label="Active Category" />
          </div>
        </div>
      </Form>
    </div>
  )
}
