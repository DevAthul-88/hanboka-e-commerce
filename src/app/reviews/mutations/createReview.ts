import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const CreateReview = z.object({
  productId: z.number(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1),
})

export default resolver.pipe(
  resolver.zod(CreateReview),
  resolver.authorize(),
  async ({ productId, rating, comment }, ctx) => {
    const review = await db.review.create({
      data: {
        userId: ctx.session.userId,
        productId,
        rating,
        comment,
      },
    })

    return review
  }
)
