import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { CategoriesList } from "./components/CategoriesList"
import { AdminLayout } from "../../Layout/AdminLayout"
import { Button } from "../../components/ui/button"
import { Plus } from "lucide-react"
import { Spinner } from "../../components/Loader"

export const metadata: Metadata = {
  title: "Categories",
  description: "List of categories",
}

export default function Page() {
  return (
    <AdminLayout>
      <div className="flex flex-wrap justify-between align-middle items-center">
        <div>
          <h2 className=" text-2xl font-bold">Categories</h2>
        </div>
        <div>
          <Button>
            <Plus /> <Link href={"/admin/categories/new"}>Create Category</Link>
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <Suspense
          fallback={
            <div className="mt-16">
              <Spinner />
            </div>
          }
        >
          <CategoriesList />
        </Suspense>
      </div>
    </AdminLayout>
  )
}
