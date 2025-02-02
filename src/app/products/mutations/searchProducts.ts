import db from "db"
import { resolver } from "@blitzjs/rpc"
import { z } from "zod"

const SearchInput = z.object({
  query: z.string().min(1),
  limit: z.number().optional().default(10),
  offset: z.number().optional().default(0),
})

export default resolver.pipe(resolver.zod(SearchInput), async ({ query, limit, offset }) => {
  const lowercaseQuery = query.toLowerCase() // Convert query to lowercase

  const products = await db.product.findMany({
    where: {
      OR: [
        {
          name: {
            contains: lowercaseQuery,
          },
        },
        {
          description: {
            contains: lowercaseQuery,
          },
        },
        {
          category: {
            name: {
              contains: lowercaseQuery,
            },
          },
        },
      ],
    },
    include: {
      images: true,
      category: true,
    },
    take: limit,
    skip: offset,
    orderBy: {
      createdAt: "desc",
    },
  })

  const total = await db.product.count({
    where: {
      OR: [
        {
          name: {
            contains: lowercaseQuery,
          },
        },
        {
          description: {
            contains: lowercaseQuery,
          },
        },
        {
          category: {
            name: {
              contains: lowercaseQuery,
            },
          },
        },
      ],
    },
  })

  return {
    products,
    total,
    hasMore: offset + limit < total,
  }
})
