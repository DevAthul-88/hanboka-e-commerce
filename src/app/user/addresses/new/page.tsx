import { Metadata } from "next"
import { Suspense } from "react"
import { New__ModelName } from "../components/NewAddress"
import ProfileLayout from "@/src/app/Layout/ProfileLayout"
import { Spinner } from "@/src/app/components/Loader"

export const metadata: Metadata = {
  title: "New Address",
  description: "Create a new address",
}

export default function Page() {
  return (
    <ProfileLayout name="Create New Address">
      <Suspense
        fallback={
          <div className="mt-16">
            <Spinner />
          </div>
        }
      >
        <New__ModelName />
      </Suspense>
    </ProfileLayout>
  )
}
