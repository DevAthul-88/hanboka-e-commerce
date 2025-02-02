// mutations/updateCartItemQuantity.ts
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const UpdateCartItemQuantitySchema = z.object({
  slug: z.string(),
  userId: z.number(),
  quantity: z.number(),
  productId: z.number(),
})

export default resolver.pipe(
  resolver.zod(UpdateCartItemQuantitySchema),
  resolver.authorize(),
  async ({ slug, quantity, userId, productId }, resolver) => {
    if (!userId) {
      throw new Error("User is not authenticated")
    }
    console.log(`My Quantity: ${quantity}`)

    return await db.cartItem.update({
      where: {
        id: productId,
        userId: userId,
        productSlug: slug,
      },
      data: { quantity },
    })
  }
)
