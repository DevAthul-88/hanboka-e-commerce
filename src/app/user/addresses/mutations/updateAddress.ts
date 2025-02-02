import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateAddressSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateAddressSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const address = await db.address.update({ where: { id }, data })

    return address
  }
)
