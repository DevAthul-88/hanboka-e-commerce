import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateProductSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateProductSchema),
  resolver.authorize(),
  async ({ id, categoryId, colorId, sizeIds, ...data }) => {
    // First get the current product
    const currentProduct = await db.product.findUnique({
      where: { id },
    })

    if (!currentProduct) {
      throw new Error("Product not found")
    }

    // Check slug uniqueness only if it's being changed
    if (data.slug && data.slug !== currentProduct.slug) {
      const existingProductWithSlug = await db.product.findFirst({
        where: {
          slug: data.slug,
          NOT: { id },
        },
      })

      if (existingProductWithSlug) {
        throw new Error("A product with this slug already exists")
      }
    }

    // Check SKU uniqueness only if it's being changed
    if (data.sku && data.sku !== currentProduct.sku) {
      const existingProductWithSku = await db.product.findFirst({
        where: {
          sku: data.sku,
          NOT: { id },
        },
      })

      if (existingProductWithSku) {
        throw new Error("A product with this SKU already exists")
      }
    }

    try {
      // Wrap all operations in a transaction
      const result = await db.$transaction(async (prisma) => {
        // Delete existing product sizes
        await prisma.productSize.deleteMany({
          where: { productId: id },
        })

        // Create new product sizes
        if (sizeIds && sizeIds.length > 0) {
          const newProductSizes = sizeIds.map((sizeId) => ({
            productId: id,
            sizeId: Number(sizeId),
          }))

          await prisma.productSize.createMany({
            data: newProductSizes,
          })
        }

        // Prepare update data with category and color connections
        const updatedData = {
          ...data,
          ...(categoryId && {
            category: {
              connect: { id: Number(categoryId) },
            },
          }),
          ...(colorId && {
            color: {
              connect: { id: Number(colorId) },
            },
          }),
        }

        // Update the product
        const product = await prisma.product.update({
          where: { id },
          data: updatedData,
        })

        return product
      })

      return result
    } catch (error) {
      console.error("Product update error:", error)
      throw new Error("Failed to update product")
    }
  }
)
