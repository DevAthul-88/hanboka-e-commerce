"use client"
import { FORM_ERROR, ProductForm } from "./ProductForm"
import { CreateProductSchema } from "../schemas"
import { useMutation } from "@blitzjs/rpc"
import createProduct from "../mutations/createProduct"
import { useRouter } from "next/navigation"

export function New__ModelName() {
  const [createProductMutation] = useMutation(createProduct)
  const router = useRouter()
  return (
    <div>
      <ProductForm
        submitText="Create Product"
        schema={CreateProductSchema}
        initialValues={{
          name: "",
          slug: "",
          sku: "",
          description: "",
          price: "",
          salePrice: "",
          categoryId: "",
          colorId: "",
          stock: "",
          isFeatured: false,
          gender: "",
          style: "",
          weight: "",
          dimensions: "",
          material: "",
          careInstructions: "",
          tags: "",
          sizeIds: null,
        }}
        onSubmit={async (values) => {
          try {
            const product = await createProductMutation(values)
            router.push(`/admin/products/${product.id}`)
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />
    </div>
  )
}
