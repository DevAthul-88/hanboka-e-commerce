import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetReviews = z.object({
  productId: z.number(),
})

export default resolver.pipe(resolver.zod(GetReviews), async ({ productId }) => {
  const reviews = await db.review.findMany({
    where: { productId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return reviews
})
