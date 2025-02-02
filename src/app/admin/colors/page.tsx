import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { ColorsList } from "./components/ColorsList"
import { AdminLayout } from "../../Layout/AdminLayout"
import { Button } from "../../components/ui/button"
import { Plus } from "lucide-react"
import { Spinner } from "../../components/Loader"

export const metadata: Metadata = {
  title: "Colors",
  description: "List of colors",
}

export default function Page() {
  return (
    <AdminLayout>
      <div className="flex flex-wrap justify-between align-middle items-center">
        <div>
          <h2 className=" text-2xl font-bold">Colors</h2>
        </div>
        <div>
          <Button>
            <Plus /> <Link href={"/admin/colors/new"}>Create Color</Link>
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
          <ColorsList />
        </Suspense>
      </div>
    </AdminLayout>
  )
}
