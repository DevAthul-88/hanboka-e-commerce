import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateCategorySchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateCategorySchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // Check if another category with same name exists (excluding current category)
    const existingCategory = await db.category.findFirst({
      where: {
        name: data.name,
        NOT: {
          id: id,
        },
      },
    })

    if (existingCategory) {
      throw new Error("Another category with this name already exists")
    }

    const category = await db.category.update({
      where: { id },
      data,
    })

    return category
  }
)
