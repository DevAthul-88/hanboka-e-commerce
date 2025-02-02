import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetProductsBySlug = z.object({
  slugs: z.array(z.string()).optional(), // Make slugs optional
})

export default resolver.pipe(resolver.zod(GetProductsBySlug), async ({ slugs = [] }) => {
  // Default slugs to an empty array if undefined or null
  if (slugs.length === 0) {
    console.log("No slugs provided, returning empty array")
    return { products: [] }
  }

  try {
    const products = await db.product.findMany({
      where: {
        slug: {
          in: slugs,
        },
      },
      select: {
        id: true,
        name: true,
        price: true,
        slug: true,
        images: {
          select: {
            url: true,
          },
          where: {
            isMain: true, // Fetch only the main image
          },
          take: 1, // Ensure only one image is returned per product
        },
      },
    })

    console.log("Fetched products:", products)

    if (products.length === 0) {
      console.log("No products found for the provided slugs:", slugs)
    }

    return { products }
  } catch (error) {
    console.error("Error fetching products from database:", error)
    return { products: [] }
  }
})
