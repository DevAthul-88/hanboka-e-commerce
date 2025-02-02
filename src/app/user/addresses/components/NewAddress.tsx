"use client"
import { FORM_ERROR, AddressForm } from "./AddressForm"
import { CreateAddressSchema } from "../schemas"
import { useMutation } from "@blitzjs/rpc"
import createAddress from "../mutations/createAddress"
import { useRouter } from "next/navigation"
import { useSession } from "@blitzjs/auth"
import { toast } from "react-toastify"

export function New__ModelName() {
  const [createAddressMutation] = useMutation(createAddress)
  const router = useRouter()
  const session = useSession()
  return (
    <AddressForm
      submitText="Create Address"
      schema={CreateAddressSchema}
      initialValues={{
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        text: "",
        isDefault: false,
      }}
      onSubmit={async (values) => {
        try {
          const address = await createAddressMutation({
            ...values,
            userId: session?.userId,
          })
          router.push(`/user/addresses`)
          toast.success("Address has created")
        } catch (error: any) {
          console.error(error)
          return {
            [FORM_ERROR]: error.toString(),
          }
        }
      }}
    />
  )
}
