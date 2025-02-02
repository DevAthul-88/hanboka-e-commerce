"use client"
import { Suspense } from "react"
import updateProduct from "../mutations/updateProduct"
import getProduct from "../queries/getProduct"
import { UpdateProductSchema } from "../schemas"
import { FORM_ERROR, ProductForm } from "./ProductForm"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import { Spinner } from "@/src/app/components/Loader"
import { toast } from "sonner"

export const EditProduct = ({ productId }: { productId: number }) => {
  const [product, { setQueryData }] = useQuery(
    getProduct,
    { id: productId },
    {
      staleTime: Infinity,
    }
  )
  const [updateProductMutation] = useMutation(updateProduct)
  const router = useRouter()

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
          <ProductForm
            submitText="Update Product"
            schema={UpdateProductSchema}
            initialValues={{
              ...product,
              sizeIds: product?.ProductSize?.map((ps) => ps.size.id),
            }}
            onSubmit={async (values) => {
              try {
                const updated = await updateProductMutation({
                  ...values,
                  id: product.id,
                })
                await setQueryData(updated)
                toast.success("Product has successfully updated")
                router.refresh()
              } catch (error: any) {
                console.error(error)
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
