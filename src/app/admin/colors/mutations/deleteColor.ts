import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteColorSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteColorSchema),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const color = await db.color.deleteMany({ where: { id } })

    return color
  }
)
