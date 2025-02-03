import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

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