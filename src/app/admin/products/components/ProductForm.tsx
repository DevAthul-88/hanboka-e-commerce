import { LabeledCheckboxField } from "@/src/app/components/LabeledCheckboxField"
import { LabeledSelectField } from "@/src/app/components/LabeledSelectField"
import { LabeledSlugField } from "@/src/app/components/LabeledSlugField"
import RichTextEditor from "@/src/app/components/RichTextEditor"
import { useQuery } from "@blitzjs/rpc"
import React, { Suspense, useMemo, useState } from "react"
import { Form, FormProps } from "src/app/components/Form"
import { LabeledTextField } from "src/app/components/LabeledTextField"

import { z } from "zod"
import getCategories from "../../categories/queries/getCategories"
import { useParams } from "next/navigation"
import getCategoriesSub from "../../categories/queries/getCategoriesSub"
export { FORM_ERROR } from "src/app/components/Form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import getColors from "../../colors/queries/getColors"
import getSizes from "../queries/getSizes"
import { LabeledCheckboxGroup } from "@/src/app/components/LabeledCheckboxGroup"

export function ProductForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const categories = useQuery(getCategoriesSub, {})
  const { categoryId } = useParams()
  const [selectedSizes, setSelectedSizes] = useState<number[]>([])

  const urlCategoryId = categoryId ? Number(categoryId) : null

  const categoryOptions =
    categories?.[0]?.categories
      .filter((category) => category.id !== urlCategoryId)
      .map((category) => ({
        label: category.name,
        value: Number(category.id),
      })) || []

  categoryOptions.unshift({ label: "None (Top Level)", value: "" })

  const colors = useQuery(getColors, {})

  const colorOptions =
    colors?.[0]?.colors.map((category) => ({
      label: category.name,
      value: Number(category.id),
    })) || []

  colorOptions.unshift({ label: "None (Top Level)", value: "" })

  const sizes = useQuery(getSizes, {})
  const sizeOptions = useMemo(
    () =>
      sizes?.[0]?.products.map((size) => ({
        label: size.name,
        value: Number(size.id),
      })) || [],
    [sizes]
  )

  const handleSizeChange = (sizeId: number) => {
    setSelectedSizes((prev) =>
      prev.includes(sizeId) ? prev.filter((id) => id !== sizeId) : [...prev, sizeId]
    )
  }

  return (
    <Form<S> {...props}>
      <Alert className=" bg-green-50 border border-green-400">
        <AlertCircle className="h-4 w-4 text-green-400" />
        <AlertTitle>Add Images to Your Product</AlertTitle>
        <AlertDescription>
          After creating a product, enhance its appeal by adding images. Upload high-quality visuals
          to showcase your product and attract more attention.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Product Basic Information */}
        <LabeledTextField
          name="name"
          label="Product Name"
          placeholder="Enter product name"
          type="text"
        />

        <LabeledSlugField
          name="slug"
          label="URL Slug"
          placeholder="url-friendly-name"
          sourceField="name"
        />

        <LabeledTextField name="sku" label="SKU" placeholder="Enter product SKU" type="text" />

        <LabeledSelectField name="colorId" label="Product Color" options={colorOptions} />

        {/* Rich Text Description */}
        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-700">Product Description</label>
          <RichTextEditor name="description" placeholder="Provide detailed product description" />
        </div>

        <div>
          <LabeledCheckboxGroup name="sizeIds" label="Available Sizes" options={sizeOptions} />
        </div>

        {/* Pricing and Inventory */}
        <LabeledTextField
          name="price"
          label="Regular Price"
          placeholder="Enter price"
          type="number"
          step="0.01"
        />

        <LabeledTextField
          name="salePrice"
          label="Sale Price"
          placeholder="Enter sale price"
          type="number"
          step="0.01"
        />

        <LabeledSelectField name="categoryId" label="Product Category" options={categoryOptions} />

        <LabeledTextField
          name="stock"
          label="Inventory Quantity"
          placeholder="Enter stock quantity"
          type="number"
        />

        <LabeledCheckboxField name="isFeatured" label="Featured Product" />

        {/* Product Attributes */}
        <LabeledSelectField
          name="gender"
          label="Gender Category"
          options={[
            { label: "Men", value: "men" },
            { label: "Women", value: "women" },
          ]}
        />

        <LabeledTextField
          name="style"
          label="Product Style"
          placeholder="Enter product style"
          type="text"
        />

        <LabeledTextField
          name="weight"
          label="Product Weight"
          placeholder="Enter weight"
          type="number"
          step="0.1"
        />

        <LabeledTextField
          name="dimensions"
          label="Product Dimensions"
          placeholder="L x W x H"
          type="text"
        />

        <LabeledTextField
          name="material"
          label="Primary Material"
          placeholder="Enter material"
          type="text"
        />

        {/* Additional Details */}
        <LabeledTextField
          name="careInstructions"
          label="Care & Maintenance"
          placeholder="Enter care instructions"
          type="text"
        />

        <LabeledTextField name="tags" label="Product Tags" placeholder="Enter tags" type="text" />
      </div>
      {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
    </Form>
  )
}
