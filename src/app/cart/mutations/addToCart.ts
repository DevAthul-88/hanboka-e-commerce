import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
import { SessionContext } from "@blitzjs/auth"

const AddToCartInput = z.object({
  productSlug: z.string(),
  quantity: z.number().min(1),
  size: z.string().nullable().optional(), // Make size optional and nullable
})

export default resolver.pipe(
  resolver.zod(AddToCartInput),
  resolver.authorize(),
  async ({ productSlug, quantity, size }, ctx: SessionContext) => {
    // Fetch the product by slug
    const product = await db.product.findFirst({
      where: { slug: productSlug },
    })

    if (!product) {
      throw new Error("Product not found")
    }

    const userId = ctx.session.userId

    // Check if the cart item exists with the same size
    const existingCartItem = await db.cartItem.findFirst({
      where: {
        userId,
        productId: product.id,
        size: size ?? "M",
      },
    })

    if (existingCartItem) {
      // If the cart item exists, update the quantity
      const updatedCartItem = await db.cartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
      })

      return updatedCartItem
    } else {
      // If no cart item exists, create a new one
      const newCartItem = await db.cartItem.create({
        data: {
          userId,
          productId: product.id,
          quantity,
          productSlug,
          size: size ?? "M", // Use the provided size or default to "M"
        },
      })

      return newCartItem
    }
  }
)
