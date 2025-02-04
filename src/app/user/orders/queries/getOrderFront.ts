import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetOrderByNumberInput = z.object({
  orderNumber: z.string(),
  userId: z.number(),
})

export default resolver.pipe(
  resolver.zod(GetOrderByNumberInput),
  resolver.authorize(),
  async ({ orderNumber, userId }) => {
    const order = await db.order.findFirst({
      where: {
        orderNumber,
        userId,
      },
      include: {
        address: true,
        items: {
          include: {
            product: {
              include: {
                images: {
                  where: { isMain: true },
                  take: 1,
                },
              },
            },
          },
        },
      },
    })

    if (!order) {
      throw new Error("Order not found")
    }

    return order
  }
)
