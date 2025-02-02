import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetAddressesInput
  extends Pick<Prisma.AddressFindManyArgs, "where" | "orderBy" | "skip" | "take"> {
  userId: number // Add userId as a required parameter
}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100, userId }: GetAddressesInput) => {
    // Validate userId (you can also use `resolver.authorize()` to ensure the user is authenticated)
    if (!userId) {
      throw new Error("User ID is required")
    }

    // Add userId to the where clause
    const {
      items: addresses,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.address.count({ where: { ...where, userId } }), // Filter by userId
      query: (paginateArgs) =>
        db.address.findMany({
          ...paginateArgs,
          where: { ...where, userId }, // Filter by userId
          orderBy,
        }),
    })

    return {
      addresses,
      nextPage,
      hasMore,
      count,
    }
  }
)
