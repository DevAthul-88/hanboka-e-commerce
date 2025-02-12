import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetCategoriesInput
  extends Pick<Prisma.CategoryFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetCategoriesInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: categories,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.category.count({ where }),
      query: (paginateArgs) =>
        db.category.findMany({
          ...paginateArgs,
          where,
          orderBy,
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            isActive: true,
            sortOrder: true,
            parent: true, // Include parent if needed
          },
        }),
    })

    return {
      categories,
      nextPage,
      hasMore,
      count,
    }
  }
)
