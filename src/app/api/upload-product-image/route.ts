import { NextResponse } from "next/server"
import uploadImage from "../../admin/products/mutations/uploadImage"
import { v4 as uuidv4 } from "uuid"

// Remove deprecated config and use new App Router configs
export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const productId = parseInt(formData.get("productId") as string)
    const isMain = formData.get("isMain") === "true"
    const altText = uuidv4()
    const sortOrder = parseInt((formData.get("sortOrder") as string) || "0")

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    // Validate file size (e.g., 5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large" }, { status: 400 })
    }

    // Convert File to buffer for Cloudinary
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const image = await uploadImage({
      productId,
      file: { buffer, mimetype: file.type, size: file.size },
      isMain,
      altText,
      sortOrder,
    })

    return NextResponse.json(image)
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}
