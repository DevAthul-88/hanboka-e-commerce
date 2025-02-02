import React from "react"
import MainLayout from "../Layout/MainLayout"
import { Metadata } from "next"
import Main from "../components/OrderConfirm/Main"

export const metadata: Metadata = {
  title: "Order Confirmation",
  description: "Order Confirmation page",
}

function page() {
  return (
    <MainLayout>
      <Main />
    </MainLayout>
  )
}

export default page
