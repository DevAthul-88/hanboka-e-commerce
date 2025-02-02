import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateOrderSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateOrderSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const order = await db.order.update({ where: { id }, data })

    return order
  }
)
