import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetColorsInput
  extends Pick<Prisma.ColorFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(async ({ where, orderBy, skip = 0, take = 100 }: GetColorsInput) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const {
    items: colors,
    hasMore,
    nextPage,
    count,
  } = await paginate({
    skip,
    take,
    count: () => db.color.count({ where }),
    query: (paginateArgs) => db.color.findMany({ ...paginateArgs, where, orderBy }),
  })

  return {
    colors,
    nextPage,
    hasMore,
    count,
  }
})
