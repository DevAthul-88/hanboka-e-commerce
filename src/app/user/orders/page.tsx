import React from "react"
import ProfileLayout from "../../Layout/ProfileLayout"
import { Metadata } from "next"
import OrdersPage from "../../components/User/orders/OrdersMain"

export const metadata: Metadata = {
  title: "Orders",
  description: "Orders page",
}

function page() {
  return (
    <ProfileLayout name="Orders">
      <OrdersPage />
    </ProfileLayout>
  )
}

export default page
