import { Metadata } from "next"
import { Suspense } from "react"
import { New__ModelName } from "../components/NewColor"
import { AdminLayout } from "@/src/app/Layout/AdminLayout"
import { Spinner } from "@/src/app/components/Loader"

export const metadata: Metadata = {
  title: "New Color",
  description: "Create a new color",
}

export default function Page() {
  return (
    <AdminLayout>
      <Suspense
        fallback={
          <div className="mt-16">
            <Spinner />
          </div>
        }
      >
        <New__ModelName />
      </Suspense>
    </AdminLayout>
  )
}
