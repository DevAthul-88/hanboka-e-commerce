import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteProductSchema } from "../schemas"
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default resolver.pipe(
  resolver.zod(DeleteProductSchema),
  resolver.authorize(),
  async ({ id }) => {
    try {
      const productImages = await db.productImage.findMany({
        where: { productId: id },
      })

      const result = await db.$transaction(async (prisma) => {
        await prisma.productSize.deleteMany({
          where: { productId: id },
        })

        await prisma.productImage.deleteMany({
          where: { productId: id },
        })

        const deletedProduct = await prisma.product.delete({
          where: { id },
        })

        return deletedProduct
      })

      for (const image of productImages) {
        try {
          // Extract public_id from the URL or store it in your database
          const publicId = `products/${id}/${image.url.split("/").pop().split(".")[0]}`
          await cloudinary.uploader.destroy(publicId)
        } catch (cloudinaryError) {
          console.error(`Failed to delete image from Cloudinary: ${cloudinaryError}`)
        }
      }

      try {
        await cloudinary.api.delete_folder(`products/${id}`)
      } catch (folderError) {
        console.error(`Failed to delete product folder from Cloudinary: ${folderError}`)
      }

      return result
    } catch (error) {
      console.error("Product deletion error:", error)
      throw new Error("Failed to delete product and its associated data")
    }
  }
)
