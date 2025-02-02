// app/product-images/mutations/setMainImage.ts
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const SetMainImageSchema = z.object({
  id: z.number(),
  productId: z.number(),
})

export default resolver.pipe(resolver.zod(SetMainImageSchema), async ({ id, productId }) => {
  // Start a transaction to ensure data consistency
  return await db.$transaction(async (tx) => {
    // First, unset any existing main image for this product
    await tx.productImage.updateMany({
      where: {
        productId,
        isMain: true,
      },
      data: {
        isMain: false,
      },
    })

    // Then set the new main image
    const updatedImage = await tx.productImage.update({
      where: { id },
      data: {
        isMain: true,
      },
    })

    return updatedImage
  })
})
