"use client"

import { invoke, useQuery } from "@blitzjs/rpc"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Spinner } from "../Loader"
import { CheckCircleIcon, Package, MapPin, Calendar, CreditCard } from "lucide-react"
import OrderNotFound from "../OrderNotFound"
import getCurrentUser from "../../admin/customers/queries/getCurrentUser"
import getOrderFront from "../../user/orders/queries/getOrderFront"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { Badge } from "../ui/badge"

function OrderConfirmation() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get("orderNumber")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      try {
        const user = await invoke(getCurrentUser, null)
        if (user !== null) {
          return
        } else {
          router.push("/login")
        }
      } catch (error) {
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  if (!orderNumber) {
    return <OrderNotFound />
  }

  const [order, { isLoading, error }] = useQuery(
    getOrderFront,
    { orderNumber },
    {
      suspense: false,
      retry: 1,
    }
  )

  if (isLoading) {
    return (
      <div className="mt-16 mb-16">
        <Spinner />
      </div>
    )
  }

  if (error || !order) {
    return <OrderNotFound />
  }

  console.log(order)

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto bg-green-100 p-3 rounded-full w-fit">
            <CheckCircleIcon className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl mt-4">Order Confirmed!</CardTitle>
          <CardDescription>
            Thank you for your purchase. Your order number is{" "}
            <span className="font-medium">{order.orderNumber}</span>
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-lg">Order Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Order Date</span>
            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Status</span>
            <Badge variant="outline" className="capitalize">
              {order.status.toLowerCase()}
            </Badge>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Amount</span>
            <span className="font-medium">${order.totalAmount.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-lg">Order Items</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {order.items.map((item, index) => (
            <div key={item.id}>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-medium">{item.product.name}</h3>
                  <div className="text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                    {item.size && ` • Size: ${item.size}`}
                    {item.color && ` • Color: ${item.color}`}
                  </div>
                </div>
                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
              {index < order.items.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-lg">Shipping Address</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <address className="not-italic text-muted-foreground">
            {order.address.street}
            <br />
            {order.address.city}, {order.address.state} {order.address.zipCode}
            <br />
            {order.address.country}
          </address>
        </CardContent>
      </Card>

      <div className="text-center pt-4">
        <Button onClick={() => router.push("/user/orders")} className="min-w-[200px]">
          View All Orders
        </Button>
      </div>
    </div>
  )
}

export default OrderConfirmation
