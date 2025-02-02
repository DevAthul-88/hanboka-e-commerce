import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteAddressSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteAddressSchema),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const address = await db.address.deleteMany({ where: { id } })

    return address
  }
)
