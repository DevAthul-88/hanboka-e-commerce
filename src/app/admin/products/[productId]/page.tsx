import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { invoke } from "src/app/blitz-server"
import getProduct from "../queries/getProduct"
import { Product } from "../components/Product"
import { AdminLayout } from "@/src/app/Layout/AdminLayout"
import { Spinner } from "@/src/app/components/Loader"

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const Product = await invoke(getProduct, { id: Number(params.productId) })
  return {
    title: `Product- ${Product.name}`,
  }
}

type ProductPageProps = {
  params: { productId: string }
}

export default async function Page({ params }: ProductPageProps) {
  return (
    <AdminLayout>
      <Suspense
        fallback={
          <div className="mt-16">
            <Spinner />
          </div>
        }
      >
        <Product productId={Number(params.productId)} />
      </Suspense>
    </AdminLayout>
  )
}

Page.authenticate = true
