import { Metadata } from "next"
import { Suspense } from "react"
import { New__ModelName } from "../components/NewCategory"
import { AdminLayout } from "@/src/app/Layout/AdminLayout"
import { Spinner } from "@/src/app/components/Loader"

export const metadata: Metadata = {
  title: "New Project",
  description: "Create a new project",
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
