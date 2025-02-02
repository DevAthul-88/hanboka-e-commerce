"use client"
import { UpdateUserForm } from "../../components/home/UserForm"
import { useQuery } from "@blitzjs/rpc"
import getCurrentUser from "../../admin/customers/queries/getCurrentUser"

import React from "react"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

function UserMain() {
  const user = useQuery(getCurrentUser, {})
  const router = useRouter()
  return (
    <div>
      <div>
        <UpdateUserForm
          initialValues={{
            id: user[0]?.id,
            name: user[0]?.name,
            email: user[0]?.email,
          }}
          onSuccess={() => {
            try {
              router.refresh()
            } catch (error: any) {
              console.error(error)
              toast.error("Something went wrong, please try again later")
            }
          }}
        />
      </div>
    </div>
  )
}

export default UserMain
