import { Metadata } from "next"
import React from "react"
import { invoke } from "src/app/blitz-server"
import getProductBySlug from "../../admin/products/queries/getProductBySlug"
import MainLayout from "../../Layout/MainLayout"
import Banner from "../../components/Banner"
import ProductsSingle from "../../components/Product/ProductsSingle"

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const data = await invoke(getProductBySlug, { slug: params.slug })
  return {
    title: `${data?.name}`,
  }
}

type ProductPageProps = {
  params: { slug: string }
}

function page({ params }: ProductPageProps) {
  return (
    <MainLayout>
      <ProductsSingle slug={params?.slug} />
    </MainLayout>
  )
}

export default page
