"use client"

import { invoke, usePaginatedQuery, useMutation } from "@blitzjs/rpc"
import React, { useEffect, useState } from "react"
import getCurrentUser from "../admin/customers/queries/getCurrentUser"
import { useRouter, useSearchParams } from "next/navigation"
import { Spinner } from "./Loader"
import Image from "next/image"
import { Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useSession } from "@blitzjs/auth"
import getAddresses from "../user/addresses/queries/getAddresses"
import { useCart } from "../cart/hooks/useCart"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { AddressForm } from "./CheckoutForm"
import { toast } from "react-toastify"
import createOrderMutation from "../user/orders/mutations/createOrderMutation"

interface Address {
  id: number
  userId: number
  street: String
  city: String
  state: String
  postalCode: String
  country: String
  isDefault: boolean
  text: String
}

interface CartItem {
  id: number
  userId: number
  productId: number
  quantity: number
  size?: string | null
  color?: string | null
  addedAt: Date
  productSlug: string
  product: {
    id: number
    name: string
    price: number
    images?: { url: string }[]
  }
}

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY!)

const ITEMS_PER_PAGE = 100

function PaymentForm({ clientSecret, onPaymentSuccess, onPaymentError }) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    try {
      const { paymentIntent, error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
        redirect: "if_required",
      })

      if (error) {
        onPaymentError(error)
        toast({
          variant: "destructive",
          title: "Payment Failed",
          description: error.message,
        })
      } else if (paymentIntent.status === "succeeded") {
        onPaymentSuccess(paymentIntent)
      }
    } catch (error) {
      onPaymentError(error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button type="submit" className="w-full mt-4" disabled={!stripe || isProcessing}>
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Pay Now"
        )}
      </Button>
    </form>
  )
}

function CheckoutMain() {
  const router = useRouter()
  const session = useSession()
  const searchParams = useSearchParams()!
  const [loading, setLoading] = useState(true)
  const [clientSecret, setClientSecret] = useState("")
  const page = Number(searchParams.get("page")) || 0

  const [{ addresses }] = usePaginatedQuery(getAddresses, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
    userId: session?.userId,
  })

  const { cartItems = [], removeFromCart, refreshCart, isLoading: cartLoading = false } = useCart()

  const [createOrderMutate] = useMutation(createOrderMutation)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(
    addresses.find((addr) => addr.isDefault) || null
  )

  // Calculate summary
  const summary = {
    subtotal: cartItems.reduce(
      (acc: number, item: CartItem) => acc + (item.product?.price || 0) * item.quantity,
      0
    ),
    shipping: 10,
    tax: cartItems.reduce(
      (acc: number, item: CartItem) => acc + (item.product?.price || 0) * item.quantity * 0.1,
      0
    ),
    total: 0,
  }
  summary.total = summary.subtotal + summary.shipping + summary.tax

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      try {
        const user = await invoke(getCurrentUser, null)
        if (!user) {
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

  useEffect(() => {
    if (cartItems.length > 0) {
      createPaymentIntent()
    }
  }, [cartItems])

  const createPaymentIntent = async () => {
    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(summary.total * 100),
          currency: "usd",
          metadata: {
            orderId: Date.now().toString(),
            userId: session?.userId,
          },
        }),
      })

      const data = await response.json()
      setClientSecret(data.clientSecret)
    } catch (error) {
      console.error("Error creating payment intent:", error)
      toast.error("Failed to initialize payment. Please try again.")
    }
  }

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      // Create order using Blitz mutation
      const order = await createOrderMutate({
        paymentIntentId: paymentIntent.id,
        addressId: selectedAddress?.id!,
        amount: summary.total,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
          size: item.size,
          color: item.color,
        })),
      })

      // Clear cart after successful order
      for (const item of cartItems) {
        await removeFromCart({ productSlug: item.productSlug })
      }
      await refreshCart()

      // Pass the order number to the confirmation page
      router.push(`/order-confirmation?orderNumber=${order.orderNumber}`)
    } catch (error) {
      console.error("Error creating order:", error)
      toast.error("Failed to create order. Please try again.")
    }
  }

  const handlePaymentError = (error) => {
    console.error("Payment error:", error)
    toast.error("Payment failed. Please try again.")
  }

  const handleRemoveItem = async (productSlug: string) => {
    try {
      await removeFromCart({ productSlug })
      await refreshCart()
    } catch (error) {
      console.error("Error removing item:", error)
      toast.error("Failed to remove item from cart.")
    }
  }

  if (loading) {
    return (
      <div className="mt-16 mb-16">
        <Spinner />
      </div>
    )
  }

  return (
    <div>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Shipping Address</h2>
                  </div>
                  <AddressForm
                    savedAddresses={addresses}
                    onAddressSelect={setSelectedAddress}
                    selectedAddress={selectedAddress}
                  />
                </CardContent>
              </Card>

              {cartItems.length > 0 && selectedAddress && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
                    {clientSecret && (
                      <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <PaymentForm
                          clientSecret={clientSecret}
                          onPaymentSuccess={handlePaymentSuccess}
                          onPaymentError={handlePaymentError}
                        />
                      </Elements>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                  {cartItems.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">Your cart is empty</div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item: CartItem) => (
                        <div key={item.id} className="flex gap-4 py-4 border-b last:border-b-0">
                          <div className="relative h-24 w-24 overflow-hidden rounded-lg border">
                            {item.product?.images?.[0]?.url ? (
                              <img
                                src={item.product.images[0].url}
                                alt={item.product.name || "Product"}
                                className="object-cover h-full w-full rounded"
                              />
                            ) : (
                              <img
                                src="/api/placeholder/64/64"
                                alt="Product placeholder"
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div className="flex flex-1 flex-col justify-between">
                            <div className="grid gap-1">
                              <h3 className="font-medium">{item.product?.name}</h3>
                              <div className="text-sm text-muted-foreground">
                                {item.size && <span>Size: {item.size} </span>}
                                {item.color && <span>Color: {item.color}</span>}
                              </div>
                              <div className="text-sm">Quantity: {item.quantity}</div>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="font-medium">
                                ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                              </p>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveItem(item.productSlug)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove item</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${summary.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>${summary.shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${summary.tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${summary.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutMain
