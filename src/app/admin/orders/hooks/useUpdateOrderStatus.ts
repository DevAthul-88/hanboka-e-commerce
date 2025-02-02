import { useMutation } from "@blitzjs/rpc"
import updateOrderStatus from "app/orders/mutations/updateOrderStatus"

export const useUpdateOrderStatus = () => {
  const [updateOrderStatusMutation] = useMutation(updateOrderStatus)

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatusMutation({
        orderId,
        status: newStatus as
          | "PENDING"
          | "PROCESSING"
          | "SHIPPED"
          | "DELIVERED"
          | "CANCELLED"
          | "CONFIRMED",
      })
      return true
    } catch (error) {
      console.error("Failed to update order status:", error)
      throw error
    }
  }

  return handleStatusUpdate
}
