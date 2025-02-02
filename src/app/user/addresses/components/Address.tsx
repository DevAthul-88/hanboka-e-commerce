"use client"
import { useMutation, useQuery } from "@blitzjs/rpc"
import Link from "next/link"
import { useRouter } from "next/navigation"
import deleteAddress from "../mutations/deleteAddress"
import getAddress from "../queries/getAddress"

export const Address = ({ addressId }: { addressId: number }) => {
  const router = useRouter()
  const [deleteAddressMutation] = useMutation(deleteAddress)
  const [address] = useQuery(getAddress, { id: addressId })

  return (
    <>
      <div>
        <h1>Project {address.id}</h1>
        <pre>{JSON.stringify(address, null, 2)}</pre>

        <Link href={`/addresses/${address.id}/edit`}>Edit</Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteAddressMutation({ id: address.id })
              router.push("/addresses")
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}
