import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const RemoveFromCartInput = z.object({
  productSlug: z.string(),
})

export default resolver.pipe(
  resolver.zod(RemoveFromCartInput),
  resolver.authorize(),
  async ({ productSlug }, ctx) => {
    const product = await db.product.findFirst({
      where: { slug: productSlug },
    })

    if (!product) {
      throw new Error("Product not found")
    }

    return await db.cartItem.deleteMany({
      where: {
        userId: ctx.session.userId,
        productId: product.id,
      },
    })
  }
)
