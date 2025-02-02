"use client"

import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function OrderNotFound() {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Order Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            We're sorry, but we couldn't find the order you're looking for. It may have been removed
            or the order number might be incorrect.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button onClick={() => router.push("/")}>Go to Homepage</Button>
          <Button variant="outline" onClick={() => router.push("/user/orders")}>
            View Your Orders
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
