import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { AddressesList } from "./components/AddressesList"
import ProfileLayout from "../../Layout/ProfileLayout"
import { Spinner } from "../../components/Loader"
import { Button } from "../../components/ui/button"
import { Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "Addresses",
  description: "List of addresses",
}

export default function Page() {
  return (
    <ProfileLayout name="Addresses">
      <div className="d-flex mb-4 justify-end">
        <div>
          <Link href={"/user/addresses/new"} scroll={false}>
            <Button>
              <Plus /> Create Address
            </Button>
          </Link>
        </div>
      </div>
      <Suspense
        fallback={
          <div className="mt-16">
            <Spinner />
          </div>
        }
      >
        <AddressesList />
      </Suspense>
    </ProfileLayout>
  )
}
