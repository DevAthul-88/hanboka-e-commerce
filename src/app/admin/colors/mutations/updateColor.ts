import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateColorSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateColorSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // Check if another color with same properties exists (excluding current color)
    const existingColor = await db.color.findFirst({
      where: {
        // Add your unique fields here, for example:
        name: data.name,
        NOT: {
          id: id,
        },
      },
    })

    if (existingColor) {
      throw new Error("Another color with these properties already exists")
    }

    // If no duplicate found, proceed with update
    const color = await db.color.update({
      where: { id },
      data,
    })

    return color
  }
)
