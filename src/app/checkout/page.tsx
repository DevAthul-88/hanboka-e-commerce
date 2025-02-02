import React from "react"
import MainLayout from "../Layout/MainLayout"
import { Metadata } from "next"
import CheckoutMain from "../components/CheckoutMain"

export const metadata: Metadata = {
  title: "Checkout",
  description: "Checkout page",
}

function page() {
  return (
    <MainLayout>
      <CheckoutMain />
    </MainLayout>
  )
}

export default page
