import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { z } from "zod"

const GetOrdersInput = z.object({
  skip: z.number().optional().default(0),
  take: z.number().optional().default(100),
  orderBy: z.any().optional(),
})

export default resolver.pipe(
  resolver.zod(GetOrdersInput),
  resolver.authorize(),
  async ({ orderBy, skip, take }) => {
    // Removed userId and where condition to fetch all orders
    const {
      items: orders,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.order.count(),
      query: (paginateArgs) =>
        db.order.findMany({
          ...paginateArgs,
          orderBy,
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            items: {
              include: {
                product: {
                  include: {
                    images: {
                      where: { isMain: true },
                      take: 1,
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
