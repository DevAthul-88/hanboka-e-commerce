import React from "react"
import ProfileLayout from "../../Layout/ProfileLayout"
import { Metadata } from "next"
import DeleteAccountPage from "../../components/DangerZone"

export const metadata: Metadata = {
  title: "Danger Zone",
  description: "Danger Zone page",
}

function page() {
  return (
    <ProfileLayout name="Danger Zone">
      <DeleteAccountPage />
    </ProfileLayout>
  )
}

export default page
