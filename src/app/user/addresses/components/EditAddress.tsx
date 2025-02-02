"use client"
import { Suspense } from "react"
import updateAddress from "../mutations/updateAddress"
import getAddress from "../queries/getAddress"
import { UpdateAddressSchema } from "../schemas"
import { FORM_ERROR, AddressForm } from "./AddressForm"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import { Spinner } from "@/src/app/components/Loader"
import Link from "next/link"
import { Button } from "@/src/app/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import { toast } from "react-toastify"

export const EditAddress = ({ addressId }: { addressId: number }) => {
  const [address, { setQueryData }] = useQuery(
    getAddress,
    { id: addressId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateAddressMutation] = useMutation(updateAddress)
  const router = useRouter()
  return (
    <>
      <div>
        <div className="d-flex mb-4 justify-end">
          <div>
            <Link href={"/user/addresses"} scroll={false}>
              <Button>
                <ArrowLeft /> Back
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
          <AddressForm
            submitText="Update Address"
            schema={UpdateAddressSchema}
            initialValues={address}
            onSubmit={async (values) => {
              try {
                const updated = await updateAddressMutation({
                  ...values,
                  id: address.id,
                })
                await setQueryData(updated)
                router.refresh()
                toast.success("Address has updated")
              } catch (error: any) {
                console.error(error)
                toast.error("Something went wrong please try agian later")
                return {
                  [FORM_ERROR]: error.toString(),
                }
              }
            }}
          />
        </Suspense>
      </div>
    </>
  )
}
