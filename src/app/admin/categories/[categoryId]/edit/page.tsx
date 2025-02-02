import { Metadata } from "next"
import { Suspense } from "react"
import { invoke } from "src/app/blitz-server"
import getCategory from "../../queries/getCategory"
import { EditCategory } from "../../components/EditCategory"
import { AdminLayout } from "@/src/app/Layout/AdminLayout"
import { Spinner } from "@/src/app/components/Loader"

type EditCategoryPageProps = {
  params: { categoryId: string }
}

export async function generateMetadata({ params }: EditCategoryPageProps): Promise<Metadata> {
  const Category = await invoke(getCategory, { id: Number(params.categoryId) })
  return {
    title: `Edit Category - ${Category.name}`,
  }
}

export default async function Page({ params }: EditCategoryPageProps) {
  return (
    <AdminLayout>
      <Suspense
        fallback={
          <div className="mt-16">
            <Spinner />
          </div>
        }
      >
        <EditCategory categoryId={Number(params.categoryId)} />
      </Suspense>
    </AdminLayout>
  )
}
