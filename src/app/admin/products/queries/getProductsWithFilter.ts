// queries/getProductsWithFilter.ts
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetProducts = z.object({
  categoryIds: z.array(z.number()).optional(),
  colorIds: z.array(z.number()).optional(),
  sizeIds: z.array(z.number()).optional(),
  page: z.number().optional().default(1),
  perPage: z.number().optional().default(20),
  sortBy: z.string().optional().default("default"), // Changed to string instead of enum
  gender: z.string().optional(), // Made this simpler
})

export default resolver.pipe(
  resolver.zod(GetProducts),
  async ({
    categoryIds,
    colorIds,
    sizeIds,
    page = 1,
    perPage = 20,
    sortBy = "default",
    gender,
  }) => {
    const where = {
      AND: [
        categoryIds?.length ? { categoryId: { in: categoryIds } } : {},
        colorIds?.length ? { colorId: { in: colorIds } } : {},
        sizeIds?.length
          ? {
              ProductSize: {
                some: {
                  sizeId: { in: sizeIds },
                },
              },
            }
          : {},
        gender ? { gender } : {},
      ].filter(Boolean), // Filter out empty objects
    }

    let orderBy: any = {}

    // Handle sorting
    switch (sortBy) {
      case "featured":
        orderBy = { isFeatured: "desc" }
        break
      case "men":
        orderBy = { gender: "asc" }
        break
      case "women":
        orderBy = { gender: "desc" }
        break
      case "latest":
        orderBy = { createdAt: "desc" }
        break
      case "bestselling":
        orderBy = { orderItems: { _count: "desc" } }
        break
      case "nameAsc":
        orderBy = { name: "asc" }
        break
      case "nameDesc":
        orderBy = { name: "desc" }
        break
      case "priceLow":
        orderBy = { price: "asc" }
        break
      case "priceHigh":
        orderBy = { price: "desc" }
        break
      case "dateOld":
        orderBy = { createdAt: "asc" }
        break
      case "dateNew":
        orderBy = { createdAt: "desc" }
        break
      default:
        orderBy = {}
    }

    const total = await db.product.count({ where })

    const FilteredProducts = await db.product.findMany({
      where,
      include: {
        images: {
          where: {
            isMain: true,
          },
        },
        sizes: true,
        color: true,
        category: true,
        reviews: true,
        orderItems: true,
        cartItems: true,
        wishedBy: true,
        ProductSize: {
          include: {
            size: true,
          },
        },
      },
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
    })

    return {
      FilteredProducts,
      pagination: {
        total,
        pageCount: Math.ceil(total / perPage),
        page,
        perPage,
      },
    }
  }
)
