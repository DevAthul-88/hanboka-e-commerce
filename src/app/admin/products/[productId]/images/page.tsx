import { Metadata } from "next"
import { Suspense } from "react"
import { invoke } from "src/app/blitz-server"
import getProduct from "../../queries/getProduct"
import { AdminLayout } from "@/src/app/Layout/AdminLayout"
import { Spinner } from "@/src/app/components/Loader"
import ProductImagesTable from "../../components/ProductImagesTable"

type EditProductPageProps = {
  params: { productId: string }
}

export async function generateMetadata({ params }: EditProductPageProps): Promise<Metadata> {
  const Product = await invoke(getProduct, { id: Number(params.productId) })
  return {
    title: `Product Images- ${Product.name}`,
  }
}

export default async function Page({ params }: EditProductPageProps) {
  return (
    <AdminLayout>
      <Suspense
        fallback={
          <div className="mt-16">
            <Spinner />
          </div>
        }
      >
        <div className="mt-4">
          <ProductImagesTable productId={Number(params.productId)} />
        </div>
      </Suspense>
    </AdminLayout>
  )
}
