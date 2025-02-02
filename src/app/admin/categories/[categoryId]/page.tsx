import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { invoke } from "src/app/blitz-server"
import getCategory from "../queries/getCategory"
import { Category } from "../components/Category"
import { AdminLayout } from "@/src/app/Layout/AdminLayout"
import { Spinner } from "@/src/app/components/Loader"

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const Category = await invoke(getCategory, { id: Number(params.categoryId) })
  return {
    title: `Category - ${Category.name}`,
  }
}

type CategoryPageProps = {
  params: { categoryId: string }
}

export default async function Page({ params }: CategoryPageProps) {
  return (
    <AdminLayout>
      <Suspense
        fallback={
          <div className="mt-16">
            <Spinner />
          </div>
        }
      >
        <Category categoryId={Number(params.categoryId)} />
      </Suspense>
    </AdminLayout>
  )
}
