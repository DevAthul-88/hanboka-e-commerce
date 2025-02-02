import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const RemoveCartItemSchema = z.object({
  slug: z.string(),
  userId: z.number(),
})

export default resolver.pipe(
  resolver.zod(RemoveCartItemSchema),
  resolver.authorize(),
  async ({ slug, userId }, resolver) => {
    return await db.cartItem.deleteMany({
      where: {
        userId: userId,
        productSlug: slug,
      },
    })
  }
)
