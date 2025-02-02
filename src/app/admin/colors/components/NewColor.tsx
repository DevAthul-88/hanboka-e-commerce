"use client"
import { FORM_ERROR, ColorForm } from "./ColorForm"
import { CreateColorSchema } from "../schemas"
import { useMutation } from "@blitzjs/rpc"
import createColor from "../mutations/createColor"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function New__ModelName() {
  const [createColorMutation] = useMutation(createColor)
  const router = useRouter()
  return (
    <ColorForm
      submitText="Create Color"
      initialValues={{
        name: "",
        hexCode: "",
      }}
      schema={CreateColorSchema}
      onSubmit={async (values) => {
        try {
          const color = await createColorMutation(values)
          router.push(`/admin/colors/${color.id}`)
          toast.success("Color created successfully")
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
