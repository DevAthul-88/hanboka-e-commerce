"use client"

import { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImageModal } from "./image-modal"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { invoke } from "@blitzjs/rpc"
import cancelOrder from "@/src/app/user/orders/mutations/cancelOrder"
import { toast } from "react-toastify"
import { Loader2 } from "lucide-react"

interface OrderItem {
  id: string
  productId: number
  product: {
    images: { url: string }[]
    name: string
  }
  quantity: number
  price: number
  size?: string
  color?: string
}

interface Order {
  id: string
  orderNumber: string
  createdAt: string
  status: "CONFIRMED" | "COMPLETED" | "PROCESSING" | "SHIPPED" | "CANCELLED"
  totalAmount: number
  items: OrderItem[]
}

interface OrdersTableProps {
  initialOrders: Order[]
  onOrderCancelled?: () => void
  refetch?: () => void
}

export function OrdersTable({ initialOrders, onOrderCancelled, refetch }: OrdersTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [status, setStatus] = useState("all")
  const [sort, setSort] = useState("date")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const pageSize = 10

  const filteredAndSortedOrders = useMemo(() => {
    let result = [...initialOrders]

    if (status !== "all") {
      result = result.filter((order) => order.status.toLowerCase() === status.toLowerCase())
    }

    result.sort((a, b) => {
      if (sort === "date") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      if (sort === "total") {
        return b.totalAmount - a.totalAmount
      }
      return 0
    })

    return result
  }, [initialOrders, status, sort])

  const totalPages = Math.ceil(filteredAndSortedOrders.length / pageSize)
  const currentOrders = filteredAndSortedOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    setCurrentPage(1)
  }

  const handleSortChange = (newSort: string) => {
    setSort(newSort)
  }

  const handleCancelOrder = async (orderId: string) => {
    try {
      setLoadingOrderId(orderId)
      setIsLoading(true)
      await invoke(cancelOrder, { orderId })
      toast.success("Order cancelled successfully")
      onOrderCancelled?.()
      await refetch?.()
      setSelectedOrder(null)
    } catch (error) {
      toast.error("Failed to cancel order")
      console.error("Error cancelling order:", error)
    } finally {
      setIsLoading(false)
      setLoadingOrderId(null)
    }
  }

  const getStatusBadgeClass = (status: string) => {
    const baseClass = "px-2 py-1 rounded-full text-xs font-medium"
    switch (status) {
      case "CONFIRMED":
        return `${baseClass} bg-blue-100 text-blue-800`
      case "COMPLETED":
        return `${baseClass} bg-green-100 text-green-800`
      case "PROCESSING":
        return `${baseClass} bg-yellow-100 text-yellow-800`
      case "SHIPPED":
        return `${baseClass} bg-purple-100 text-purple-800`
      case "CANCELLED":
        return `${baseClass} bg-red-100 text-red-800`
      default:
        return baseClass
    }
  }

  const isCancelDisabled = (status: string) => {
    return ["COMPLETED", "SHIPPED", "CANCELLED"].includes(status)
  }

  return (
    <div className="w-full overflow-auto">
      <div className="flex justify-between mb-4">
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="total">Total</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Image</TableHead>
              <TableHead className="w-32">Order ID</TableHead>
              <TableHead className="w-32">Date</TableHead>
              <TableHead className="w-32">Status</TableHead>
              <TableHead className="w-32">Total</TableHead>
              <TableHead className="min-w-[200px]">Items</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <ImageModal
                    src={order.items[0]?.product.images[0]?.url || "/placeholder.svg"}
                    alt="Product"
                  />
                </TableCell>
                <TableCell className="font-medium">{order.orderNumber}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={getStatusBadgeClass(order.status)}>{order.status}</span>
                </TableCell>
                <TableCell className="font-medium">${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  {order.items.map((item) => (
                    <div key={item.id} className="mb-2 last:mb-0">
                      <p className="text-sm font-medium">
                        {item.product.name} × {item.quantity}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)}
                        {item.size && ` • Size: ${item.size}`}
                        {item.color && ` • Color: ${item.color}`}
                      </p>
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isCancelDisabled(order.status) || isLoading}
                    onClick={() => setSelectedOrder(order)}
                  >
                    {loadingOrderId === order.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Cancel"
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel order {selectedOrder?.orderNumber}? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep order</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedOrder && handleCancelOrder(selectedOrder.id)}
              className="gap-2 mt-2"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Yes, cancel order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
