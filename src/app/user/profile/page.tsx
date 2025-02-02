import React from "react"
import ProfileLayout from "../../Layout/ProfileLayout"
import { Metadata } from "next"
import Dashboard from "../../components/User/Dashboard"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard page",
}

function page() {
  return (
    <ProfileLayout name="Dashboard">
      <Dashboard />
    </ProfileLayout>
  )
}

export default page
