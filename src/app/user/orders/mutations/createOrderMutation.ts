import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const CreateOrderInput = z.object({
  paymentIntentId: z.string(),
  addressId: z.number(),
  amount: z.number(),
  items: z.array(
    z.object({
      productId: z.number(),
      quantity: z.number(),
      price: z.number(),
      size: z.string().nullable().optional(),
      color: z.string().nullable().optional(),
    })
  ),
})

export default resolver.pipe(
  resolver.zod(CreateOrderInput),
  resolver.authorize(),
  async (input, ctx) => {
    try {
      // Verify payment intent
      const paymentIntent = await stripe.paymentIntents.retrieve(input.paymentIntentId)

      if (paymentIntent.status !== "succeeded") {
        throw new Error("Payment not successful")
      }

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // Create order and update stock in a single transaction
      const order = await db.$transaction(async (tx) => {
        // Verify that the address exists
        const address = await tx.address.findUnique({
          where: { id: input.addressId },
        })

        if (!address) {
          throw new Error("Address not found")
        }

        // Create the order
        const newOrder = await tx.order.create({
          data: {
            orderNumber,
            userId: ctx.session.userId,
            addressId: input.addressId,
            totalAmount: input.amount,
            paymentStatus: "PAID",
            paymentMethod: "STRIPE",
            status: "CONFIRMED",
            items: {
              create: input.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                size: item.size ?? null,
                color: item.color ?? null,
              })),
            },
          },
          include: {
            items: true,
            address: true,
          },
        })

        // Reduce product stock based on quantity ordered
        for (const item of input.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity, // Reduce stock
              },
            },
          })
        }

        // Clear the user's cart
        await tx.cartItem.deleteMany({
          where: {
            userId: ctx.session.userId,
          },
        })

        return newOrder
      })

      return order
    } catch (error) {
      console.error("Order creation error:", error)

      if (error instanceof Error) {
        throw new Error(`Failed to create order: ${error.message}`)
      }
      throw new Error("Failed to create order")
    }
  }
)
