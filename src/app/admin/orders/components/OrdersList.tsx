"use client"
import { usePaginatedQuery, useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { usePathname } from "next/navigation"
import { Route } from "next"
import { Button } from "@/src/app/components/ui/button"
import getOrders from "../queries/getOrders"
import { OrdersTable, useRefreshStore } from "./OrdersTable"
import updateOrderStatus from "../mutations/updateOrderStatus"

const ITEMS_PER_PAGE = 100

export const OrdersList = () => {
  const searchparams = useSearchParams()!
  const page = Number(searchparams.get("page")) || 0
  const [{ orders, hasMore }, { refetch }] = useQuery(getOrders, {})
  const router = useRouter()
  const pathname = usePathname()

  const goToPreviousPage = () => {
    const params = new URLSearchParams(searchparams)
    params.set("page", (page - 1).toString())
    router.push((pathname + "?" + params.toString()) as Route)
  }
  const goToNextPage = () => {
    const params = new URLSearchParams(searchparams)
    params.set("page", (page + 1).toString())
    router.push((pathname + "?" + params.toString()) as Route)
  }

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatus(
        {
          orderId: orderId,
          status: newStatus,
        },
        {}
      )
      await refetch()
    } catch (error) {
      console.error("Error updating status:", error)
      throw error
    }
  }

  return (
    <div>
      <OrdersTable orders={orders} refreshData={refetch} onStatusChange={handleStatusChange} />

      <div className="mt-2 flex gap-2">
        <Button disabled={page === 0} onClick={goToPreviousPage}>
          Previous
        </Button>
        <Button disabled={!hasMore} onClick={goToNextPage}>
          Next
        </Button>
      </div>
    </div>
  )
}
