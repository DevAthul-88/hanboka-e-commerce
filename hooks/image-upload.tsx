import uploadImage from "@/src/app/admin/products/mutations/uploadImage"
import { useMutation } from "@blitzjs/rpc"
import { toast } from "sonner"

export const useUploadProductImage = () => {
  const [uploadImageMutation] = useMutation(uploadImage)

  const upload = async ({
    file,
    productId,
    isMain = false,
    altText,
    sortOrder,
  }: {
    file: File
    productId: number
    isMain?: boolean
    altText?: string
    sortOrder?: number
  }) => {
    try {
      // Create FormData
      const formData = new FormData()
      formData.append("file", file)
      formData.append("productId", productId.toString())
      formData.append("isMain", isMain.toString())
      if (altText) formData.append("altText", altText)
      if (sortOrder) formData.append("sortOrder", sortOrder.toString())

      const response = await fetch("/api/upload-product-image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Upload failed")
      }

      const data = await response.json()
      toast.success("Image uploaded successfully")
      return data
    } catch (error) {
      toast.error(error.message || "Failed to upload image")
      throw error
    }
  }

  return { upload }
}
