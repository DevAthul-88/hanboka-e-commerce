import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetProductsInput
  extends Pick<Prisma.ProductFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(async ({ where, orderBy, skip = 0, take = 100 }: GetProductsInput) => {
  const {
    items: products,
    hasMore,
    nextPage,
    count,
  } = await paginate({
    skip,
    take,
    count: () => db.size.count({ where }),
    query: (paginateArgs) =>
      db.size.findMany({
        ...paginateArgs,
        where,
        orderBy,
      }),
  })

  return {
    products,
    nextPage,
    hasMore,
    count,
  }
})
