import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateCategorySchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateCategorySchema),
  resolver.authorize(),
  async (input) => {
    // Check if category with same name already exists
    const existingCategory = await db.category.findFirst({
      where: {
        name: input.name,
      },
    })

    if (existingCategory) {
      throw new Error("A category with this name already exists")
    }

    const category = await db.category.create({ data: input })

    return category
  }
)
