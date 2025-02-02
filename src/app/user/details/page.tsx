import { Metadata } from "next"
import React from "react"
import ProfileLayout from "../../Layout/ProfileLayout"
import UserMain from "../../components/home/UserMain"

export const metadata: Metadata = {
  title: "Details",
  description: "Details page",
}

function page() {
  return (
    <ProfileLayout name="Account Details">
      <UserMain />
    </ProfileLayout>
  )
}

export default page
