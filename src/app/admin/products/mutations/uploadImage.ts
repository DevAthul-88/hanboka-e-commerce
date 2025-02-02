import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const UploadImageSchema = z.object({
  productId: z.number(),
  file: z.any(),
  isMain: z.boolean().optional().default(false),
  altText: z.string().optional(),
  sortOrder: z.number().optional().default(0),
})

export default resolver.pipe(
  resolver.zod(UploadImageSchema),
  async ({ productId, file, isMain, altText, sortOrder }) => {
    try {
      // Check if there are any existing images for this product
      const existingImages = await db.productImage.count({
        where: { productId },
      })

      // If no existing images, force this one to be main
      if (existingImages === 0) {
        isMain = true
      }

      // If this is set as main image, unset any existing main images
      if (isMain) {
        await db.productImage.updateMany({
          where: { productId, isMain: true },
          data: { isMain: false },
        })
      }

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `products/${productId}`,
            resource_type: "auto",
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )

        // Convert buffer to stream and pipe to Cloudinary
        const bufferStream = require("stream").Readable.from(file.buffer)
        bufferStream.pipe(uploadStream)
      })

      // Create database record
      const image = await db.productImage.create({
        data: {
          url: result.secure_url,
          productId,
          isMain,
          altText,
          sortOrder,
        },
      })

      return image
    } catch (error) {
      console.error("Upload error:", error)
      throw new Error("Failed to upload image")
    }
  }
)
