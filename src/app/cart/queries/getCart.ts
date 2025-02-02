import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetCartItemsInput
  extends Pick<Prisma.ProductFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

// Make all input parameters optional
export default resolver.pipe(async (input: Partial<GetCartItemsInput> = {}, ctx) => {
  const { where = {}, orderBy, skip = 0, take = 100 } = input

  // Ensure user is authenticated
  const userId = ctx.session.userId
  if (!userId) {
    return { items: [], nextPage: null, hasMore: false, count: 0 }
  }

  const {
    items: cartItems,
    hasMore,
    nextPage,
    count,
  } = await paginate({
    skip,
    take,
    count: () =>
      db.cartItem.count({
        where: { ...where, userId },
      }),
    query: (paginateArgs) =>
      db.cartItem.findMany({
        ...paginateArgs,
        where: { ...where, userId },
        orderBy,
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      }),
  })

  return {
    cartItems,
    nextPage,
    hasMore,
    count,
  }
})
