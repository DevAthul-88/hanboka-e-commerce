import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetCategorySchema = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(GetCategorySchema), async ({ id }) => {
  const category = await db.category.findFirst({
    where: { id },
    include: {
      parent: {
        select: {
          id: true,
          name: true,
          nameKorean: true,
          slug: true,
          description: true,
          imageUrl: true,
          isActive: true,
          sortOrder: true,
          parentId: true,
        },
      },
      children: {
        select: {
          id: true,
          name: true,
          nameKorean: true,
          slug: true,
          description: true,
          imageUrl: true,
          isActive: true,
          sortOrder: true,
          parentId: true,
          _count: {
            select: {
              children: true,
              products: true,
            },
          },
        },
        orderBy: {
          sortOrder: "asc",
        },
      },
      _count: {
        select: {
          products: true,
          children: true,
        },
      },
    },
  })

  if (!category) throw new Error("Category not found")

  return category
})
