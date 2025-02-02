// queries/getProductsWithFilter.ts
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetProducts = z.object({
  slug: z.string().min(1, "Category slug is required"),
  page: z.number().optional().default(1),
  perPage: z.number().optional().default(20),
  sortBy: z.string().optional().default("default"),
})

export default resolver.pipe(
  resolver.zod(GetProducts),
  async ({ slug, page = 1, perPage = 20, sortBy = "default" }) => {
    let orderBy: any = {}
    const category = await db.category.findFirst({
      where: { slug: slug },
      select: { id: true },
    })

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

    const total = await db.product.count({
      where: {
        categoryId: category?.id,
      },
    })

    console.log(category)

    const products = await db.product.findMany({
      where: {
        categoryId: category?.id,
      },
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
      products,
      pagination: {
        total,
        pageCount: Math.ceil(total / perPage),
        page,
        perPage,
      },
    }
  }
)
