import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateColorSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateColorSchema),
  resolver.authorize(),
  async (input) => {
    // Check if color with same properties already exists
    const existingColor = await db.color.findFirst({
      where: {
        // Add your unique fields here, for example:
        name: input.name,
        // If you're checking hex value:
        // hexValue: input.hexValue,
      },
    })

    if (existingColor) {
      throw new Error("A color with these properties already exists")
    }

    // If no duplicate found, create the new color
    const color = await db.color.create({ data: input })

    return color
  }
)
