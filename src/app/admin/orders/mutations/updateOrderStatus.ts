import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const UpdateOrderStatus = z.object({
  orderId: z.number(),
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "CONFIRMED"]),
})

export default resolver.pipe(
  resolver.zod(UpdateOrderStatus),
  resolver.authorize(),
  async ({ orderId, status }) => {
    const order = await db.order.update({
      where: { id: orderId },
      data: {
        status,
        updatedAt: new Date(),
      },
    })

    return order
  }
)
