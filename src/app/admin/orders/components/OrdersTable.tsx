"use client"

import * as React from "react"
import { type ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { create } from "zustand"
import { flexRender } from "@tanstack/react-table"
import { Loader2, Package } from "lucide-react"
import { toast } from "sonner"

interface OrderItem {
  id: number
  quantity: Int
  price: number
  size?: string
  color?: string
  product: {
    id: number
    name: string
    images: Array<{
      url: string
    }>
  }
}

interface Order {
  id: number
  name: string
  email: string
  orderNumber: string
  totalAmount: number
  status: "CONFIRMED" | "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  paymentStatus: string
  paymentMethod?: string
  trackingNumber?: string
  shippingMethod?: string
  notes?: string
  createdAt: Date
  items: OrderItem[]
}

interface RefreshState {
  refreshTrigger: number
  triggerRefresh: () => void
}

export const useRefreshStore = create<RefreshState>((set) => ({
  refreshTrigger: 0,
  triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
}))

interface OrderDetailsProps {
  order: Order
  onClose: () => void
}

const OrderDetails = ({ order, onClose }: OrderDetailsProps) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadgeColor = (status: string) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      PROCESSING: "bg-blue-100 text-blue-800 border-blue-200",
      SHIPPED: "bg-purple-100 text-purple-800 border-purple-200",
      DELIVERED: "bg-green-100 text-green-800 border-green-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const statusBadgeClass = `px-2 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
    order.status
  )}`
  const paymentStatusBadgeClass = `px-2 py-1 rounded-full text-sm font-medium ${
    order.paymentStatus === "PAID"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-yellow-100 text-yellow-800 border-yellow-200"
  }`

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <div className="flex items-center justify-between">
          <DialogTitle className="text-xl font-bold">Order #{order.orderNumber}</DialogTitle>
          <span className={statusBadgeClass}>{order.status}</span>
        </div>
        <p className="text-sm text-gray-500">Created on {formatDate(order.createdAt)}</p>
      </DialogHeader>

      <div className="space-y-8 py-4">
        {/* Customer and Order Info Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Customer Details</h3>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{order.user.name}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{order.user.email}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Payment Information</h3>
              <div className="space-y-2">
                <p className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span className={paymentStatusBadgeClass}>{order.paymentStatus}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Method:</span>
                  <span className="font-medium">{order.paymentMethod || "N/A"}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold text-lg">${order.totalAmount.toFixed(2)}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items Section */}
        <div className="bg-white rounded-lg border">
          <h3 className="font-semibold text-lg p-4 border-b">Order Items</h3>
          <div className="divide-y">
            {order.items.map((item) => (
              <div key={item.id} className="p-4 flex items-start gap-4">
                <div className="flex-shrink-0">
                  {item.product.images[0] ? (
                    <img
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-md border"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-grow space-y-1">
                  <h4 className="font-medium text-lg">{item.product.name}</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-gray-600">
                      Quantity: <span className="font-medium">{item.quantity}</span>
                    </p>
                    <p className="text-gray-600">
                      Price: <span className="font-medium">${item.price.toFixed(2)}</span>
                    </p>
                    {item.size && (
                      <p className="text-gray-600">
                        Size: <span className="font-medium">{item.size}</span>
                      </p>
                    )}
                    {item.color && (
                      <p className="text-gray-600">
                        Color: <span className="font-medium">{item.color}</span>
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 font-bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">
                ${order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
              </span>
            </div>
            {/* You can add more summary items here like shipping, tax, etc. */}
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total:</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        {order.notes && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Notes</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{order.notes}</p>
          </div>
        )}
      </div>
    </DialogContent>
  )
}

const OrderStatusSelect = ({
  row,
  onStatusChange,
}: {
  row: any
  onStatusChange: (orderId: number, newStatus: string) => Promise<void>
}) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const currentStatus = row.original.status

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true)
    try {
      await onStatusChange(row.original.id, newStatus)
      toast.success(`Order status updated to ${newStatus}`)
    } catch (error) {
      toast.error("Failed to update order status")
      console.error("Error updating order status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Select value={currentStatus} onValueChange={handleStatusChange} disabled={isLoading}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="PROCESSING">Processing</SelectItem>
            <SelectItem value="SHIPPED">Shipped</SelectItem>
            <SelectItem value="DELIVERED">Delivered</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  )
}

export function OrdersTable({
  orders,
  refreshData,
  onStatusChange,
}: {
  orders: Order[]
  refreshData: () => void
  onStatusChange: (orderId: number, newStatus: string) => Promise<void>
}) {
  const [isLoading, setIsLoading] = React.useState(false)
  const { refreshTrigger } = useRefreshStore()
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null)

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "name",
      header: "User Name",
      cell: ({ row }) => <span>{row.original.user.name}</span>,
    },
    {
      accessorKey: "email",
      header: "User Email",
      cell: ({ row }) => <span>{row.original.user.email}</span>,
    },
    {
      accessorKey: "orderNumber",
      header: "Order Number",
    },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
      cell: ({ row }) => <span>${row.original.totalAmount.toFixed(2)}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <OrderStatusSelect row={row} onStatusChange={onStatusChange} />,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedOrder(row.original)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
          >
            <Package className="h-4 w-4" />
            View Details
          </button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  React.useEffect(() => {
    refreshData()
  }, [refreshTrigger])

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      PROCESSING: "bg-blue-100 text-blue-800",
      SHIPPED: "bg-purple-100 text-purple-800",
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        {selectedOrder && (
          <OrderDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        )}
      </Dialog>
    </div>
  )
}
