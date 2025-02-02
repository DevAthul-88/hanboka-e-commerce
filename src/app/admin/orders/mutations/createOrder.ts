import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateOrderSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateOrderSchema),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const order = await db.order.create({ data: input })

    return order
  }
)
