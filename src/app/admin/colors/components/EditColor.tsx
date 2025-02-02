"use client"
import { Suspense } from "react"
import updateColor from "../mutations/updateColor"
import getColor from "../queries/getColor"
import { UpdateColorSchema } from "../schemas"
import { FORM_ERROR, ColorForm } from "./ColorForm"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import { Spinner } from "@/src/app/components/Loader"

export const EditColor = ({ colorId }: { colorId: number }) => {
  const [color, { setQueryData }] = useQuery(
    getColor,
    { id: colorId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateColorMutation] = useMutation(updateColor)
  const router = useRouter()
  return (
    <>
      <div>
        <Suspense
          fallback={
            <div className="mt-16">
              <Spinner />
            </div>
          }
        >
          <ColorForm
            submitText="Update Color"
            schema={UpdateColorSchema}
            initialValues={color}
            onSubmit={async (values) => {
              try {
                const updated = await updateColorMutation({
                  ...values,
                  id: color.id,
                })
                await setQueryData(updated)
                router.refresh()
              } catch (error: any) {
                console.error(error)
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
