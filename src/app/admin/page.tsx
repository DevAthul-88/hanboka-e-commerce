import { BlitzPage, Routes } from "@blitzjs/next"
import React from "react"
import { AdminLayout } from "../Layout/AdminLayout"
import { Metadata } from "next"
import AdminDashboard from "../components/dashboard/overview"

export const metadata: Metadata = {
  title: "Admin",
  description: "Admin page",
}

const Page: BlitzPage = () => {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  )
}

export default Page
