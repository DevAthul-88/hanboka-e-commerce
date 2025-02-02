import { Metadata } from "next"
import { Suspense } from "react"
import { invoke } from "src/app/blitz-server"
import getAddress from "../../queries/getAddress"
import { EditAddress } from "../../components/EditAddress"
import ProfileLayout from "@/src/app/Layout/ProfileLayout"
import { Spinner } from "@/src/app/components/Loader"

type EditAddressPageProps = {
  params: { addressId: string }
}

export async function generateMetadata({ params }: EditAddressPageProps): Promise<Metadata> {
  const Address = await invoke(getAddress, { id: Number(params.addressId) })
  return {
    title: `Edit Address`,
  }
}

export default async function Page({ params }: EditAddressPageProps) {
  return (
    <ProfileLayout name={"Edit Address"}>
      <Suspense
        fallback={
          <div className="mt-16">
            <Spinner />
          </div>
        }
      >
        <EditAddress addressId={Number(params.addressId)} />
      </Suspense>
    </ProfileLayout>
  )
}
