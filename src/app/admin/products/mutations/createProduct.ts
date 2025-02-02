import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateProductSchema } from "../schemas"
import { AuthorizationError } from "blitz"

export default resolver.pipe(
  resolver.zod(CreateProductSchema),
  resolver.authorize(),
  async (input) => {
    const { sizeIds, ...productData } = input

    // Check for unique slug
    const existingProductWithSlug = await db.product.findFirst({
      where: { slug: productData.slug },
    })

    if (existingProductWithSlug) {
      throw new Error("A product with this slug already exists")
    }

    // Check for unique SKU
    const existingProductWithSku = await db.product.findFirst({
      where: { sku: productData.sku },
    })

    if (existingProductWithSku) {
      throw new Error("A product with this SKU already exists")
    }

    try {
      // Start a transaction to ensure data consistency
      const result = await db.$transaction(async (prisma) => {
        // Create the product
        const product = await prisma.product.create({
          data: productData,
        })

        // Create product sizes if provided
        if (sizeIds && sizeIds.length > 0) {
          await prisma.productSize.createMany({
            data: sizeIds.map((sizeId) => ({
              productId: product.id,
              sizeId: Number(sizeId),
            })),
          })
        }

        return product
      })

      return result
    } catch (error) {
      // Handle any other database errors
      console.error("Product creation error:", error)
      throw new Error("Failed to create product")
    }
  }
)
