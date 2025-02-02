"use client"

import { OrdersTable } from "./orders-table"
import { NoOrdersFound } from "../../no-orders-found"
import { useQuery } from "@blitzjs/rpc"
import getOrdersFront from "@/src/app/user/orders/queries/getOrdersFront"
import { useSession } from "@blitzjs/auth"

export default function OrdersPage() {
  const currentUser = useSession()

  const [{ orders } = {}, { isLoading, isError, refetch }] = useQuery(
    getOrdersFront,
    { userId: currentUser?.userId, take: 100, orderBy: { createdAt: "desc" } },
    { suspense: false, enabled: Boolean(currentUser?.userId) } // Prevents unnecessary queries
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Loading orders...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-lg font-semibold text-red-500">
          Failed to load orders. Please try again later.
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Orders History</h1>

      {orders && orders.length > 0 ? (
        <OrdersTable initialOrders={orders} refetch={refetch} />
      ) : (
        <NoOrdersFound />
      )}
    </div>
  )
}
