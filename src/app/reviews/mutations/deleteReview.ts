import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const DeleteReview = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteReview),
  resolver.authorize(),
  async ({ id }, ctx) => {
    const review = await db.review.findFirst({
      where: { id },
      select: { userId: true },
    })

    if (!review) throw new Error("Review not found")

    // Check if user is owner or admin
    if (review.userId !== ctx.session.userId && ctx.session.role !== "ADMIN") {
      throw new Error("You don't have permission to delete this review")
    }

    const deletedReview = await db.review.delete({
      where: { id },
    })

    return deletedReview
  }
)
