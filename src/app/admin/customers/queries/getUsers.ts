import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetUsersInput
  extends Pick<Prisma.UserFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetUsersInput) => {
    // Ensure users' roles are not 'ADMIN'
    const {
      items: users,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.user.count({ where: { ...where, role: { not: "ADMIN" } } }),
      query: (paginateArgs) =>
        db.user.findMany({
          ...paginateArgs,
          where: { ...where, role: { not: "ADMIN" } },
          orderBy,
          include: {
            _count: {
              select: { orders: true }, // Include orders count for each user
            },
          },
        }),
    })

    // Map users to include the total orders count
    const usersWithOrders = users.map((user) => ({
      ...user,
      totalOrders: user._count?.orders || 0, // Extract orders count
    }))

    return {
      users: usersWithOrders,
      nextPage,
      hasMore,
      count,
    }
  }
)
