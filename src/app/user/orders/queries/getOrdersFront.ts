import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { z } from "zod"

const GetOrdersInput = z.object({
  userId: z.number(), // Make userId required
  skip: z.number().optional().default(0),
  take: z.number().optional().default(100),
  orderBy: z.any().optional(),
})

export default resolver.pipe(
  resolver.zod(GetOrdersInput),
  resolver.authorize(),
  async ({ userId, orderBy, skip, take }) => {
    const where: Prisma.OrderWhereInput = {
      userId, // Filter orders by userId
    }

    const {
      items: orders,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.order.count({ where }),
      query: (paginateArgs) =>
        db.order.findMany({
          ...paginateArgs,
          where,
          orderBy,
          include: {
            items: {
              include: {
                product: {
                  include: {
                    images: {
                      where: { isMain: true }, // Fetch only the main image
                      take: 1, // Ensure only one image is retrieved
                    },
                  },
                },
              },
            },
          },
        }),
    })

    return {
      orders,
      nextPage,
      hasMore,
      count,
    }
  }
)
