import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetCategoriesInput
  extends Pick<Prisma.CategoryFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  async ({ where, orderBy, skip = 0, take = 100 }: GetCategoriesInput) => {
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
          where: {
            ...where,
            OR: [
              { parentId: null }, // Include root-level categories
              { parentId: { not: null } }, // Include child categories
            ],
          },
          orderBy,
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            isActive: true,
            sortOrder: true,
            parentId: true,
          },
        }),
    })

    // Create a map to organize categories by parentId
    const categoryMap: Record<number | null, any[]> = {}

    // Populate the map with the categories
    categories.forEach((category) => {
      const parentId = category.parentId
      if (!categoryMap[parentId]) {
        categoryMap[parentId] = []
      }
      categoryMap[parentId].push(category)
    })

    // Build the hierarchical structure
    const formatCategories = (parentId: number | null): any[] => {
      return (categoryMap[parentId] || []).map((category) => ({
        ...category,
        children: formatCategories(category.id),
      }))
    }

    // Root-level categories have parentId null
    const formattedCategories = formatCategories(null)

    return {
      categories: formattedCategories,
      nextPage,
      hasMore,
      count,
    }
  }
)
