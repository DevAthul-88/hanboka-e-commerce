import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteCategorySchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteCategorySchema),
  resolver.authorize(),
  async ({ id }) => {
    // First, check if any products are using this category
    const productsWithCategory = await db.product.findFirst({
      where: { categoryId: id },
      select: { id: true },
    })

    // If products are found, throw an error
    if (productsWithCategory) {
      throw new Error(
        "Cannot delete category because it is assigned to one or more products. Please remove the category from all products first."
      )
    }

    // If no products are using the category, proceed with deletion
    const category = await db.category.deleteMany({ where: { id } })

    return category
  }
)
