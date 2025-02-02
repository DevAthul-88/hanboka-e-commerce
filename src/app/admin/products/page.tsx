import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { ProductsList } from "./components/ProductsList"
import { AdminLayout } from "../../Layout/AdminLayout"
import { Spinner } from "../../components/Loader"
import { Button } from "../../components/ui/button"
import { Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "Products",
  description: "List of products",
}

export default function Page() {
  return (
    <AdminLayout>
      <div className="flex flex-wrap justify-between align-middle items-center">
        <div>
          <h2 className=" text-2xl font-bold">Products</h2>
        </div>
        <div>
          <Button>
            <Plus /> <Link href={"/admin/products/new"}>Create Product</Link>
          </Button>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="mt-16">
            <Spinner />
          </div>
        }
      >
        <div className="mt-4">
          <ProductsList />
        </div>
      </Suspense>
    </AdminLayout>
  )
}

Page.authenticate = true
