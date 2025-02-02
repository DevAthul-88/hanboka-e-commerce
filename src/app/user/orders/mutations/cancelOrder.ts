import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const CancelOrder = z.object({
  orderId: z.number(),
})

export default resolver.pipe(resolver.zod(CancelOrder), async ({ orderId }) => {
  const order = await db.order.update({
    where: { id: orderId },
    data: {
      status: "CANCELLED",
    },
  })

  return order
})
