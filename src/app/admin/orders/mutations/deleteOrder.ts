import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteOrderSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteOrderSchema),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const order = await db.order.deleteMany({ where: { id } })

    return order
  }
)
