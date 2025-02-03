import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, currency, metadata } = body

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    // Return client secret for front-end to confirm payment
    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ message: "Error creating payment intent" }, { status: 500 })
  }
}

export async function confirmPaymentIntent(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    // Check if the PaymentIntent has already succeeded
    if (paymentIntent.status === "succeeded") {
      return { message: "Payment already succeeded, no confirmation needed." }
    }

    // If not, confirm the PaymentIntent
    const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntentId)

    return { message: "Payment confirmed successfully", paymentIntent: confirmedPaymentIntent }
  } catch (error) {
    console.error("Error confirming payment intent:", error)
    throw new Error("Error confirming payment intent")
  }
}
