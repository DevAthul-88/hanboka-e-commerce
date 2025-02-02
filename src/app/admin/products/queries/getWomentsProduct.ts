import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import * as z from "zod"

// Input validation schema
const GetProducts = z.object({
  where: z.record(z.any()).optional(),
  orderBy: z.record(z.any()).optional(),
  skip: z.number().optional(),
  take: z.number().optional(),
})

// Input type
export interface GetProductsInput
  extends Pick<Prisma.ProductFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.zod(GetProducts),
  async ({ where, orderBy, skip = 0, take = 100 }: GetProductsInput) => {
    const {
      items: products,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () =>
        db.product.count({
          where: {
            ...where,
            gender: "women", // Filter products by gender (e.g., "men")
          },
        }),
      query: (paginateArgs) =>
        db.product.findMany({
          ...paginateArgs,
          where: {
            ...where,
            gender: "women", // Filter products by gender (e.g., "men")
          },
          orderBy,
          include: {
            category: true,
            images: true,
            color: true,
            reviews: true,
          },
        }),
    })

    return {
      products,
      hasMore,
      nextPage,
      count,
    }
  }
)
