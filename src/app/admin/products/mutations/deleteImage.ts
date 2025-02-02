// app/product-images/mutations/deleteImage.ts
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const DeleteImageSchema = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteImageSchema), async ({ id }) => {
  // Get the image first to get the Cloudinary URL
  const image = await db.productImage.findFirst({
    where: { id },
  })

  if (!image) {
    throw new Error("Image not found")
  }

  try {
    // Extract public_id from Cloudinary URL
    const urlParts = image.url.split("/")
    const fileName = urlParts[urlParts.length - 1]
    const publicId = `products/${image.productId}/${fileName.split(".")[0]}`

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId)

    // Delete from database
    await db.productImage.delete({
      where: { id },
    })

    return { success: true }
  } catch (error) {
    console.error("Delete error:", error)
    throw new Error("Failed to delete image")
  }
})
